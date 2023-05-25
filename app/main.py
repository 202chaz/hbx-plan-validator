from typing import Union, Annotated

from fastapi import FastAPI, UploadFile, Form, File, Request
from fastapi.middleware.cors import CORSMiddleware

import pdfplumber
import re
import numpy
import pandas as pd

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/file/sbc")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}

@app.post("/plan_names")
async def plan_names(request: Request, file: UploadFile = File(...)):
  content = await file.read()
  workbook = pd.ExcelFile(content)
  sheets = workbook.sheet_names
  plans_arr = []

  for sheet in sheets:
    # get the cost share sheets
    if 'Cost' in sheet:
      # get plan names
      plan_names = pd.read_excel(content, sheet_name=sheet, skiprows=[0,1], usecols=["Plan Variant Marketing Name*", "HIOS Plan ID\n(Standard Component + Variant)"])
      # plan_names = pd.read_excel("/content/Aetna Life PBT_v3.0.xlsm", sheet_name=[sheet], skiprows=[0,1])
      for plan in plan_names.values:
        plans_arr.append({'key': plan[0], 'plan_name': plan[1], 'sheet_name': sheet})
  return plans_arr

@app.post("/pbt_data")
async def pbt_data(plan_name: str = Form(...), sheet_name:str = Form(...), file: UploadFile = File(...)):
  content = await file.read()
  arr = []


  maximum_out_of_pocket_for_medical_and_drug_ehb_benefits = pd.read_excel(content, sheet_name=sheet_name, usecols="AN:AU")
  i = 0
  arr.append({'key': 'Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)', 'data': []})
  for row in maximum_out_of_pocket_for_medical_and_drug_ehb_benefits.items():
    if isinstance(row[1][0], str):
      i += 1
      arr[0]['data'].append({'key': row[1][0], 'data': []})
    if i <= 1:
      arr[0]['data'][i-1]['data'].append({row[1][1]:str(row[1][2])})
    if i > 1 and i <= 2:
      arr[0]['data'][i-1]['data'].append({row[1][1]:str(row[1][2])})
    if i > 2 and i <= 3:
      arr[0]['data'][i-1]['data'].append({row[1][1]:str(row[1][2])})
    if i > 3 and i <= 4:
      arr[0]['data'][i-1]['data'].append({row[1][1]:str(row[1][2])})

  return { 'data': arr }

@app.post("/plan_details")
async def plan_names(plan_name: str = Form(...), sheet_name:str = Form(...), file: UploadFile = File(...)):
  content = await file.read()

  df = pd.read_excel(content, sheet_name=sheet_name, skiprows=[0,1])
  plan_row = df.loc[df['Plan Variant Marketing Name*'] == plan_name]

  hios = pd.DataFrame(plan_row, columns=['HIOS Plan ID\n(Standard Component + Variant)']).values[0][0]
  plan_name = pd.DataFrame(plan_row, columns=['Plan Variant Marketing Name*']).values[0][0]
  metal_level = pd.DataFrame(plan_row, columns=['Level of Coverage\n(Metal Level)']).values[0][0]
  medical_drug_deductibles_integrated = pd.DataFrame(plan_row, columns=['Medical & Drug Deductibles Integrated?*']).values[0][0]
  medical_drug_maximum_out_of_pocket_integrated = pd.DataFrame(plan_row, columns=['Medical & Drug Maximum Out of Pocket Integrated?*']).values[0][0]

  # scb scenarios
  s = pd.read_excel(content, sheet_name=sheet_name)

  # Primary Care Visit to Treat an Injury or Illness

  primary_care_visit_to_treat_illness_or_injury = s.iloc[0:3, 111:117]
  primary_care_visit_to_treat_illness_or_injury_arr = []
  i = 0
  for (columnName, columnData) in primary_care_visit_to_treat_illness_or_injury.items():
    i += 1
    eh_type = 'copay' if i < 4 else 'coinsurance' 
    primary_care_visit_to_treat_illness_or_injury_arr.append({'type': eh_type, columnData.values[1]: str(columnData.values[2])})
  
  # Specialist Visit
  specialist_visit = s.iloc[0:3, 117:123]
  specialist_visit_arr = []
  i = 0
  for (columnName, columnData) in specialist_visit.items():
      i += 1
      eh_type = 'copay' if i < 4 else 'coinsurance' 
      specialist_visit_arr.append({'type': eh_type, columnData.values[1]: str(columnData.values[2])})
  
  # Home Health Care Services
  home_health_care_services = s.iloc[0:3, 159:165]
  home_health_care_services_arr = []
  i = 0
  for (columnName, columnData) in home_health_care_services.items():
      i += 1
      eh_type = 'copay' if i < 4 else 'coinsurance' 
      home_health_care_services_arr.append({'type': eh_type, columnData.values[1]: str(columnData.values[2])})

  return { 'hios': hios, 'plan_name': plan_name, 'metal_level': metal_level, 'medical_drug_deductibles_integrated': medical_drug_deductibles_integrated, 
  'medical_drug_maximum_out_of_pocket_integrated': medical_drug_maximum_out_of_pocket_integrated, 'primary_care_visit_to_treat_illness_or_injury': primary_care_visit_to_treat_illness_or_injury_arr, 'specialist_visit': specialist_visit_arr, 'home_health_care_services': home_health_care_services_arr }
  
@app.post("/sbc")
async def sbc(request: Request, file: UploadFile = File(...)):
  # Try to get the plan name
  pdf = pdfplumber.open(file.file)
  pages = pdf.pages
  arr = []
  arr.append({'key': 'Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)', 'data': []})
  arr[0]['data'].append({'key': 'In Network', 'data': []})
  arr[0]['data'].append({'key': 'In Network (Tier 2)', 'data': []})
  arr[0]['data'].append({'key': 'Out of Network', 'data': []})
  arr[0]['data'].append({'key': 'Combined In/Out Network', 'data': []})

  for page in pages:
    tables = page.extract_table()
    if tables is not None:
      for table in tables:
        # Gets max out of the pocket limits
        if 'What is the out-of-pocket\nlimitfor this plan?' in table[0]:
          data = table[1].replace("\n","").replace("/","")
          words = data.split()
          i = 0
        
          for word in words:
            if '$' in word:
              i += 1
              value = word.replace("individual", "")
              if i and i == 1:
                arr[0]['data'][0]['data'].append({'Individual': value})
                arr[0]['data'][1]['data'].append({'Individual': ''})
                arr[0]['data'][3]['data'].append({'Individual': ''})
              if i and i == 2:
                arr[0]['data'][0]['data'].append({'Family': value})
                arr[0]['data'][1]['data'].append({'Family': ''})
                arr[0]['data'][3]['data'].append({'Family': ''})
              if i and i == 3:
                arr[0]['data'][2]['data'].append({'Individual': value})
              if i and i == 4:
                arr[0]['data'][2]['data'].append({'Family': value})
  
  return {"data": arr}

@app.post("/sob")
async def sob(request: Request, file: UploadFile = File(...)):
  pdf = pdfplumber.open(file.file)
  pages = pdf.pages

  detected_carrier = ''
  arr = []
  arr.append({'key': 'Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)', 'data': []})
  arr[0]['data'].append({'key': 'In Network', 'data': []})
  arr[0]['data'].append({'key': 'In Network (Tier 2)', 'data': []})
  arr[0]['data'].append({'key': 'Out of Network', 'data': []})
  arr[0]['data'].append({'key': 'Combined In/Out Network', 'data': []})

  for page in pages:
    text = page.extract_text()
    table = page.extract_table()
    carriers = ['carefirst', 'kaiser', 'aetna']
    # try to detect carrier for selecting parser
    for carrier in carriers:
      carrier = re.match(carrier, text, re.IGNORECASE)
      
      if not detected_carrier and carrier:
        detected_carrier = carrier.group(0).lower()
      
    if not detected_carrier or detected_carrier == 'aetna':
      matchers = ['Maximum out-of-pocket limit Network', 'Out-of-Pocket Maximum']
      
      for i,line in enumerate(text.splitlines()):
        if 'Maximum out-of-pocket limit Network' in line:
          individual = text.splitlines()[i+1]
          for ind in individual.split():
            if '$' in ind:
              arr[0]['data'][0]['data'].append({'Individual': str(ind.replace('.',''))})
              arr[0]['data'][1]['data'].append({'Individual': ''})
              arr[0]['data'][2]['data'].append({'Individual': ''})
              arr[0]['data'][3]['data'].append({'Individual': ''})
          family = text.splitlines()[i+2]
          for fam in family.split():
            if '$' in fam:
              arr[0]['data'][0]['data'].append({'Family': str(fam.replace('.',''))})
              arr[0]['data'][1]['data'].append({'Family': ''})
              arr[0]['data'][2]['data'].append({'Family': ''})
              arr[0]['data'][3]['data'].append({'Family': ''})

    elif detected_carrier == 'carefirst':
      matchers = ['Maximum out-of-pocket limit', 'Out-of-Pocket Maximum']
      query = table[0][0].lower()
      count = list(map(str.lower, matchers)).count(query)

      if count > 0:
        # print(table)
        for row in table:
          if 'Individual Benefit Period Out-of-Pocket Maximum' in row[0]:
            lines = row[0].splitlines()
            for line in lines:
              if 'Individual Benefit Period' in line:
                for l in line.split():
                  if '$' in l:
                    arr[0]['data'][0]['data'].append({'Individual': str(l.replace('.',''))})
                    arr[0]['data'][1]['data'].append({'Individual': ''})
                    arr[0]['data'][2]['data'].append({'Individual': ''})
                    arr[0]['data'][3]['data'].append({'Individual': ''})
          if 'Family Benefit Period Out-of-Pocket Maximum' in row[0]:
            lines = row[0].splitlines()
            for line in lines:
              if 'Family Benefit Period' in line:
                for l in line.split():
                  if '$' in l:
                    arr[0]['data'][0]['data'].append({'Family': str(l.replace('.',''))})
                    arr[0]['data'][1]['data'].append({'Family': ''})
                    arr[0]['data'][2]['data'].append({'Family': ''})
                    arr[0]['data'][3]['data'].append({'Family': ''})
              
    elif detected_carrier == 'kaiser':
      for i,line in enumerate(text.splitlines()):
        matchers = ['Maximum out-of-pocket limit', 'Out-of-Pocket Maximum']
        query = line
        count = list(map(str, matchers)).count(query)

        if count > 0:
          individual = text.splitlines()[i+1].split()
          family = text.splitlines()[i+2].split()
          
          for i in individual:
            if '$' in i:
              arr[0]['data'][0]['data'].append({'Individual': str(i)})
              arr[0]['data'][1]['data'].append({'Individual': ''})
              arr[0]['data'][2]['data'].append({'Individual': ''})
              arr[0]['data'][3]['data'].append({'Individual': ''})
          for f in family:
            if '$' in f:
              arr[0]['data'][0]['data'].append({'Family': str(f)})
              arr[0]['data'][1]['data'].append({'Family': ''})
              arr[0]['data'][2]['data'].append({'Family': ''})
              arr[0]['data'][3]['data'].append({'Family': ''})

  

  return {"data": arr}

@app.post("/pbt")
async def pbt(request: Request, file: UploadFile = File(...)):
  content = await file.read()
