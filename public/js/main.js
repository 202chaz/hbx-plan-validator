function parseFile(type) {
  const input = document.getElementById(type);
  const fileType = input.files[0].name.split('.')[1];
  // Verifies the file is an excel file
  if (fileType === 'xlsm' || fileType === 'xls' || fileType === 'pdf') {
      if (type === 'pbt') parsePBT(input)
      if (type === 'sbc') parseSBC(input)
      if (type === 'sob') parseSOB(input)
  } else {
      return console.error('Please upload an excel file');
  }
}

function parsePBT(input) {
  const availableSheets = [];
  readXlsxFile(input.files[0], { getSheets: true }).then((sheets) => {
     let index = sheets.findIndex(s => s.name === "Benefits Package 1")
      // Get the rows for the sheet and builds the table rows
      let tableRows = [];

      readXlsxFile(input.files[0], { sheet: 2 }).then(function(rows, index) {
          // Get Benefit rows
          rows.map((row, index) => {
              if (index > 58 && index < 99) {
                  let tableBody = document.getElementById('pbt-body');
                  let title = row[0];
                  let inNetworkCovered = row[3];
                  let outNetworkCovered = row[10];
                  let tableRow = document.createElement('tr');
                  let tableData = document.createElement('td');
                  let tableDataTwo = document.createElement('td');
                  let tableDataThree = document.createElement('td');
                  tableData.innerHTML = title;
                  tableDataTwo.innerHTML = inNetworkCovered;
                  tableDataThree.innerHTML = outNetworkCovered
                  tableRow.append(tableData)
                  tableRow.append(tableDataTwo)
                  tableRow.append(tableDataThree)
                  tableBody.append(tableRow)
              }
          })            
      })
  })
}

function parseSBC(input) {
  const file = input.files[0];
  const dataForm = new FormData();
  dataForm.append('sbc', file)
  axios.post('/sbcUpload', dataForm, {
      headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then(res => {
      console.log(res)
      const data = res.data.cost
      if (data.carrier) document.getElementById('SBC-Carrier').innerText = ` ${data.carrier}`;
      // Build table with data
      let tableBody = document.getElementById('sbc-body');
      while (tableBody.hasChildNodes()) {
          tableBody.removeChild(tableBody.lastChild);
      }
      let tableRow = document.createElement('tr');
      tableRow.classList.add('two');
      let tableRowTwo = document.createElement('tr');
      tableRowTwo.classList.add('one');
      let tableRowThree = document.createElement('tr');
      tableRowThree.classList.add('four');
      let tableRowFour = document.createElement('tr');
      tableRowFour.classList.add('three');
      let tableRowFive = document.createElement('tr');
      tableRowFive.classList.add('five');
      let tableRow6 = document.createElement('tr');
      tableRow6.classList.add('six');
      let tableRow7 = document.createElement('tr');
      tableRow7.classList.add('seven');
      let tableRow8 = document.createElement('tr');
      tableRow8.classList.add('eight');
      let tableRow9 = document.createElement('tr');
      tableRow9.classList.add('nine');
      let tableRow10 = document.createElement('tr');
      tableRow10.classList.add('ten');
      let tableRow11 = document.createElement('tr');
      tableRow11.classList.add('eleven');
      let tableRow12 = document.createElement('tr');
      tableRow12.classList.add('twelve');
      let tableData = document.createElement('td');
      let tableDataTwo = document.createElement('td');
      let tableDataThree = document.createElement('td');
      let tableDataFour = document.createElement('td');
      let tableDataFive= document.createElement('td');
      let tableDataSix = document.createElement('td');
      let tableDataSeven = document.createElement('td');
      let tableDataEight = document.createElement('td');
      let tableDataNine = document.createElement('td');
      let tableDataTen = document.createElement('td');
      let tableDataEleven = document.createElement('td');
      let tableDataTwelve = document.createElement('td');
      let tableData13 = document.createElement('td');
      let tableData14 = document.createElement('td');
      let tableData15 = document.createElement('td');
      let tableData16 = document.createElement('td');
      let tableData17 = document.createElement('td');
      let tableData18 = document.createElement('td');
      let tableData19 = document.createElement('td');
      let tableData20 = document.createElement('td');
      let tableData21 = document.createElement('td');
      let tableData22 = document.createElement('td');
      let tableData23 = document.createElement('td');
      let tableData24 = document.createElement('td');
      let tableData25 = document.createElement('td');
      let tableData26 = document.createElement('td');
      let tableData27 = document.createElement('td');
      let tableData28 = document.createElement('td');
      let tableData29 = document.createElement('td');
      let tableData30 = document.createElement('td');
      let tableData31 = document.createElement('td');
      let tableData32 = document.createElement('td');
      let tableData33 = document.createElement('td');
      let tableData34= document.createElement('td');
      let tableData35 = document.createElement('td');
      let tableData36 = document.createElement('td');
      tableData.innerHTML = 'Family Deductible'
      tableDataTwo.innerHTML = data.inNetworkFamilyDeductible
      tableDataThree.innerHTML = data.outOfNetworkFamilyDeductible || 'N/A'
      tableDataFour.innerHTML = 'Individual Deductible'
      tableDataFive.innerHTML = data.inNetworkIndividualDeductible
      tableDataSix.innerHTML = data.outOfNetworkIndividualDeductible || 'N/A'
      tableDataSeven.innerHTML = 'Family Out of Pocket'
      tableDataEight.innerHTML = data.inNetworkFamilyOutOfPocketLimit
      tableDataNine.innerHTML = data.outOfNetworkFamilyOutOfPocketLimit || 'N/A'
      tableDataTen.innerHTML = 'Individual Out of Pocket'
      tableDataEleven.innerHTML = data.inNetworkIndividualOutOfPocketLimit
      tableDataTwelve.innerHTML = data.outOfNetworkIndividualOutOfPocketLimit || 'N/A'
      tableData13.innerHTML = 'Primary Care Visit'
      tableData14.innerHTML = data.primaryCareVisitIn
      tableData15.innerHTML = data.primaryCareVisitOut || 'N/A'
      tableData16.innerHTML = 'Specialist Visit'
      tableData17.innerHTML = data.specialistVisitIn
      tableData18.innerHTML = data.specialistVisitOut || 'N/A'
      tableData19.innerHTML = 'Preventative Care'
      tableData20.innerHTML = data.preventativeCareIn
      tableData21.innerHTML = data.preventativeCareOut || 'N/A'
      tableData22.innerHTML = 'Diagnostic Test'
      tableData23.innerHTML = `${data.diagnosticTestXrayIn} X-ray/ ${data.diagnosticTestBloodTestIn} Blood Test`
      tableData24.innerHTML = data.diagnosticTestXrayOut || 'N/A'
      tableData25.innerHTML = 'Imaging (CT/PET scans, MRIs)'
      tableData26.innerHTML = data.imagingIn
      tableData27.innerHTML = data.imagingOut || 'N/A'
      tableData28.innerHTML = 'Preferred Generic Drugs'
      tableData29.innerHTML = `${data.preferredGenericDrugs30DayIn} 30 day supply/ ${data.preferredGenericDrugs90DayIn} 90 day supply`
      tableData30.innerHTML = data.preferredGenericDrugs30DayOut || 'N/A'
      tableData31.innerHTML = 'Preferred Brand Drugs'
      tableData32.innerHTML = `${data.preferredbrandDrugs30DayIn} 30 day supply/ ${data.preferredbrandDrugs90DayIn} 90 day supply`
      tableData33.innerHTML = data.preferredbrandDrugs30DayOut || 'N/A'
      tableRow.append(tableData)
      tableRow.append(tableDataTwo)
      tableRow.append(tableDataThree)
      tableRowTwo.append(tableDataFour)
      tableRowTwo.append(tableDataFive)
      tableRowTwo.append(tableDataSix)
      tableRowThree.append(tableDataSeven)
      tableRowThree.append(tableDataEight)
      tableRowThree.append(tableDataNine)
      tableRowFour.append(tableDataTen)
      tableRowFour.append(tableDataEleven)
      tableRowFour.append(tableDataTwelve)
      tableRowFive.append(tableData13)
      tableRowFive.append(tableData14)
      tableRowFive.append(tableData15)
      tableRow6.append(tableData16)
      tableRow6.append(tableData17)
      tableRow6.append(tableData18)
      tableRow7.append(tableData19)
      tableRow7.append(tableData20)
      tableRow7.append(tableData21)
      tableRow8.append(tableData22)
      tableRow8.append(tableData23)
      tableRow8.append(tableData24)
      tableRow9.append(tableData25)
      tableRow9.append(tableData26)
      tableRow9.append(tableData27)
      tableRow10.append(tableData28)
      tableRow10.append(tableData29)
      tableRow10.append(tableData30)
      tableRow11.append(tableData31)
      tableRow11.append(tableData32)
      tableRow11.append(tableData33)
      tableBody.append(tableRowTwo)
      tableBody.append(tableRow)
      tableBody.append(tableRowFour)
      tableBody.append(tableRowThree)
      tableBody.append(tableRowFive)
      tableBody.append(tableRow6)
      tableBody.append(tableRow7)
      tableBody.append(tableRow8)
      tableBody.append(tableRow9)
      tableBody.append(tableRow10)
      tableBody.append(tableRow11)
      // Clears form input
      document.getElementById('sbc').value = '';
      // Checks tables data
      compareTables()
  })
  .catch(err => console.log(err)); 
}

function parseSOB(input) {
  const file = input.files[0];
  const dataForm = new FormData();
  dataForm.append('sob', file)
  axios.post('/sobUpload', dataForm, {
      headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then(res => {
      const data = res.data.cost
      if (data.carrier) document.getElementById('SOB-Carrier').innerText = ` ${data.carrier}`;
      // Build table with data
      let tableBody = document.getElementById('sob-body');
      while (tableBody.hasChildNodes()) {
          tableBody.removeChild(tableBody.lastChild);
      }
      let tableRow = document.createElement('tr');
      tableRow.classList.add('two');
      let tableRowTwo = document.createElement('tr');
      tableRowTwo.classList.add('one');
      let tableRowThree = document.createElement('tr');
      tableRowThree.classList.add('four');
      let tableRowFour = document.createElement('tr');
      tableRowFour.classList.add('three');
      let tableRowFive = document.createElement('tr');
      tableRowFive.classList.add('five');
      let tableRow6 = document.createElement('tr');
      tableRow6.classList.add('six');
      let tableRow7 = document.createElement('tr');
      tableRow7.classList.add('seven');
      let tableRow8 = document.createElement('tr');
      tableRow8.classList.add('eight');
      let tableRow9 = document.createElement('tr');
      tableRow9.classList.add('nine');
      let tableRow10 = document.createElement('tr');
      tableRow10.classList.add('ten');
      let tableRow11 = document.createElement('tr');
      tableRow11.classList.add('eleven');
      let tableRow12 = document.createElement('tr');
      tableRow12.classList.add('twelve');
      let tableData = document.createElement('td');
      let tableDataTwo = document.createElement('td');
      let tableDataThree = document.createElement('td');
      let tableDataFour = document.createElement('td');
      let tableDataFive= document.createElement('td');
      let tableDataSix = document.createElement('td');
      let tableDataSeven = document.createElement('td');
      let tableDataEight = document.createElement('td');
      let tableDataNine = document.createElement('td');
      let tableDataTen = document.createElement('td');
      let tableDataEleven = document.createElement('td');
      let tableDataTwelve = document.createElement('td');
      let tableData13 = document.createElement('td');
      let tableData14 = document.createElement('td');
      let tableData15 = document.createElement('td');
      let tableData16 = document.createElement('td');
      let tableData17 = document.createElement('td');
      let tableData18 = document.createElement('td');
      let tableData19 = document.createElement('td');
      let tableData20 = document.createElement('td');
      let tableData21 = document.createElement('td');
      let tableData22 = document.createElement('td');
      let tableData23 = document.createElement('td');
      let tableData24 = document.createElement('td');
      let tableData25 = document.createElement('td');
      let tableData26 = document.createElement('td');
      let tableData27 = document.createElement('td');
      let tableData28 = document.createElement('td');
      let tableData29 = document.createElement('td');
      let tableData30 = document.createElement('td');
      let tableData31 = document.createElement('td');
      let tableData32 = document.createElement('td');
      let tableData33 = document.createElement('td');
      let tableData34= document.createElement('td');
      let tableData35 = document.createElement('td');
      let tableData36 = document.createElement('td');
      tableData.innerHTML = 'Family Deductible'
      tableDataTwo.innerHTML = data.inNetworkFamilyDeductible
      tableDataThree.innerHTML = data.outOfNetworkFamilyDeductible || 'N/A'
      tableDataFour.innerHTML = 'Individual Deductible'
      tableDataFive.innerHTML = data.inNetworkIndividualDeductible
      tableDataSix.innerHTML = data.outOfNetworkIndividualDeductible || 'N/A'
      tableDataSeven.innerHTML = 'Family Out of Pocket'
      tableDataEight.innerHTML = data.inNetworkFamilyOutOfPocketLimit
      tableDataNine.innerHTML = data.outOfNetworkFamilyOutOfPocketLimit || 'N/A'
      tableDataTen.innerHTML = 'Individual Out of Pocket'
      tableDataEleven.innerHTML = data.inNetworkIndividualOutOfPocketLimit
      tableDataTwelve.innerHTML = data.outOfNetworkIndividualOutOfPocketLimit || 'N/A'
      tableData13.innerHTML = 'Primary Care Visit'
      tableData14.innerHTML = data.primaryCareVisitIn
      tableData15.innerHTML = data.primaryCareVisitOut || 'N/A'
      tableData16.innerHTML = 'Specialist Visit'
      tableData17.innerHTML = data.specialistVisitIn
      tableData18.innerHTML = data.specialistVisitOut || 'N/A'
      tableData19.innerHTML = 'Preventative Care'
      tableData20.innerHTML = data.preventativeCareIn
      tableData21.innerHTML = data.preventativeCareOut || 'N/A'
      tableData22.innerHTML = 'Diagnostic Test'
      tableData23.innerHTML = `${data.diagnosticTestXrayIn} X-ray/ ${data.diagnosticTestBloodTestIn} Blood Test`
      tableData24.innerHTML = data.diagnosticTestXrayOut || 'N/A'
      tableData25.innerHTML = 'Imaging (CT/PET scans, MRIs)'
      tableData26.innerHTML = data.imagingIn
      tableData27.innerHTML = data.imagingOut || 'N/A'
      tableData28.innerHTML = 'Preferred Generic Drugs'
      tableData29.innerHTML = `${data.preferredGenericDrugs30DayIn} 30 day supply/ ${data.preferredGenericDrugs90DayIn} 90 day supply`
      tableData30.innerHTML = data.preferredGenericDrugs30DayOut || 'N/A'
      tableData31.innerHTML = 'Preferred Brand Drugs'
      tableData32.innerHTML = `${data.preferredbrandDrugs30DayIn} 30 day supply/ ${data.preferredbrandDrugs90DayIn} 90 day supply`
      tableData33.innerHTML = data.preferredbrandDrugs30DayOut || 'N/A'
      tableRow.append(tableData)
      tableRow.append(tableDataTwo)
      tableRow.append(tableDataThree)
      tableRowTwo.append(tableDataFour)
      tableRowTwo.append(tableDataFive)
      tableRowTwo.append(tableDataSix)
      tableRowThree.append(tableDataSeven)
      tableRowThree.append(tableDataEight)
      tableRowThree.append(tableDataNine)
      tableRowFour.append(tableDataTen)
      tableRowFour.append(tableDataEleven)
      tableRowFour.append(tableDataTwelve)
      tableRowFive.append(tableData13)
      tableRowFive.append(tableData14)
      tableRowFive.append(tableData15)
      tableRow6.append(tableData16)
      tableRow6.append(tableData17)
      tableRow6.append(tableData18)
      tableRow7.append(tableData19)
      tableRow7.append(tableData20)
      tableRow7.append(tableData21)
      tableRow8.append(tableData22)
      tableRow8.append(tableData23)
      tableRow8.append(tableData24)
      tableRow9.append(tableData25)
      tableRow9.append(tableData26)
      tableRow9.append(tableData27)
      tableRow10.append(tableData28)
      tableRow10.append(tableData29)
      tableRow10.append(tableData30)
      tableRow11.append(tableData31)
      tableRow11.append(tableData32)
      tableRow11.append(tableData33)
      tableBody.append(tableRowTwo)
      tableBody.append(tableRow)
      tableBody.append(tableRowFour)
      tableBody.append(tableRowThree)
      tableBody.append(tableRowFive)
      tableBody.append(tableRow6)
      tableBody.append(tableRow7)
      tableBody.append(tableRow8)
      tableBody.append(tableRow9)
      tableBody.append(tableRow10)
      tableBody.append(tableRow11)
      // Clears form input
      document.getElementById('sob').value = '';
      // Checks tables data
      compareTables()
  })
  .catch(err => console.log(err)); 
}

function compareTables() {
  let sob = document.getElementById('sob-body');
  let sbc = document.getElementById('sbc-body');
  const sobrows = sob.querySelectorAll('tr')
  const sbcrows = sbc.querySelectorAll('tr')
  if (sobrows.length > 0 && sbcrows.length > 0) {
    Array.from(sobrows).forEach((sobrow, index) => {
        let sbcrow = sbcrows[index]
        let sobrowval = sobrow.querySelectorAll('td')[1].innerHTML
        let sbcrowval = sbcrow.querySelectorAll('td')[1].innerHTML
        if (sobrowval !== sbcrowval) {
            sobrow.classList.add('table-danger')
            sbcrow.classList.add('table-danger')
        } else {
            sobrow.classList.remove('table-danger')
            sbcrow.classList.remove('table-danger')
        }
    })
  }
}

function submitForm(id) {
  const form = document.getElementById(id)
  // form.submit()
  console.log(form)
}