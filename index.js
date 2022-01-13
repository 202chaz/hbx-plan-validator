
const express = require('express')
const app = express()
app.use(express.static('public'))
app.use(express.json())
const port = 3000
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");
const multer  = require('multer')
const carriers = ['aetna', 'cigna', 'unitedhealth', 'anthem', 'carefirst', 'blue cross'] 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      cb(null,  file.originalname );
  }
})
const uploader = multer({ storage: storage})

const clearDir = (uploadPath) => {
  const file = fs.existsSync(uploadPath)
  if (file) {
    fs.unlink(uploadPath, (err) => {
      if (err) {
        console.log(err)
        return
      }
    })
  }
}

const sbcUpload = (req, res, next) => {
  const file = req.file
  const path = file.path
  getSBCContent(path, res)
}

const sobUpload = (req, res, next) => {
  const file = req.file
  const path = file.path
  getSOBContent(path, res)
}

async function getSBCContent(filename, res) {
  const doc = await pdfjs.getDocument(filename).promise // note the use of the property promise
  const pages = [1,2,3]
  let hash = {}
  pages.map(async (p) => {
    if (p == 1) {
      const page = await doc.getPage(p)
      let data = await page.getTextContent()
      let items = data.items
      minIndex = 0
      maxIndex = 0
      // Get the first table in PDF
      items.map((item, index) => {
        if (item.str.includes("Important Questions")) minIndex = index
        if (item.str.includes('Do you need a ')) maxIndex = index
        if (item.str.includes('aetna')) {
          hash['carrier'] = 'Aetna'
        }
      })

      deductibleIndex = 0
      outOfPocketIndex = 0
      inNetworkDeductibleFamily = 0
      inNetworkDeductibleIndividual = 0
      inNetworkOutOfPocketIndividual = 0
      inNetworkOutOfPocketFamily = 0
      // Parse the data from the first table
      items.map((item, index) => {
        if (index >= minIndex && index <= maxIndex) {
          // Gets overall deductible Values
          if (item.str.includes('Year,')) deductibleIndex = index

          if (index >= deductibleIndex && index <= (deductibleIndex + 4)) {
            if (item.str.includes('Individual ')) inNetworkDeductibleIndividual = item.str.replace('Individual', '').replace(':  ', '').replace('/', '').trim()
            if (item.str.includes('Family ')) inNetworkDeductibleFamily = item.str.replace('Family ', '').replace('.', '').trim()
          }
          // Get Out of Pocket Limit
          if (item.str.includes('for this plan?')) outOfPocketIndex = index
          if (index >= outOfPocketIndex && index <= (outOfPocketIndex + 4)) {
            if (item.str.includes('Individual ')) {
              inNetworkOutOfPocketIndividual = item.str.split('/')[0].replace(':', '').replace(' Individual ', '').trim()
              inNetworkOutOfPocketFamily = item.str.split('/')[1].replace(' Family ', '').replace('.', '').trim()
            }
          }
        }
      })

      hash['inNetworkIndividualDeductible'] = inNetworkDeductibleIndividual
      hash['inNetworkFamilyDeductible'] = inNetworkDeductibleFamily
      hash['inNetworkIndividualOutOfPocketLimit'] = inNetworkOutOfPocketIndividual
      hash['inNetworkFamilyOutOfPocketLimit'] = inNetworkOutOfPocketFamily
    } else if (p === 2) {
      const page = await doc.getPage(p)
      let data = await page.getTextContent()
      let items = data.items
      minIndex = 0
      maxIndex = 0
      // Get the second table in PDF
      items.map((item, index) => {
        if (item.str.includes("Medical Event")) minIndex = index
        if (item.str.includes(" 2 of 6")) maxIndex = index
      })

      items.map((item, index) => {
        if (index >= minIndex && index <= maxIndex) {
         if (item.str && item.str.trim() === 'No charge' || item.str && item.str.match(/\d+/g)) {
           if (index > 20 && index < 30) hash['primaryCareVisitIn'] = item.str.trim()
           if (index > 30 && index < 40) hash['specialistVisitIn'] = item.str.trim()
           if (index > 40 && index < 60) hash['preventativeCareIn'] = item.str.trim()
           if (index > 60 && index < 68) hash['diagnosticTestXrayIn'] = item.str.replace('Lab:', '').trim()
           if (index > 68 && index < 76) hash['diagnosticTestBloodTestIn'] = item.str.replace('Lab:', '').trim()
           if (index >= 77 && index < 90) hash['imagingIn'] = item.str.replace('Lab:', '').trim()
           if (index >= 90 && index <= 102) hash['preferredGenericDrugs30DayIn'] = item.str.replace('Lab:', '').trim()
           if (index >= 104 && index <= 107) hash['preferredGenericDrugs90DayIn'] = item.str.replace('Lab:', '').trim()
           if (index >= 124 && index <= 127) hash['preferredbrandDrugs30DayIn'] = item.str.replace('Lab:', '').trim()
           if (index >= 129 && index <= 131) hash['preferredbrandDrugs90DayIn'] = item.str.replace('Lab:', '').trim()
           if (index >= 134 && index <= 137) hash['nonPreferredbrandDrugs30DayIn'] = item.str.replace('Lab:', '').trim()
           if (index >= 138 && index <= 142 && (item.str.trim().includes('$') || item.str.trim().includes('%') || item.str.trim().includes('no charge'))) hash['nonPreferredbrandDrugs90DayIn'] = item.str.replace('Lab:', '').trim()
           if (index >= 148 && index <= 151 && (item.str.trim().includes('$') || item.str.trim().includes('%') || item.str.trim().includes('no charge'))) hash['specialtyDrugs30DayIn'] = item.str.replace('Lab:', '').replace('up to a ', '').trim()
         }
        }
      })
    } else if (p === 3) {

    }
  })
  setTimeout(() => {
    return res.status(200).json({cost: hash})
  }, 1000)
 
}



async function getSOBContent(filename, res) {
  const doc = await pdfjs.getDocument(filename).promise // note the use of the property promise
  let pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  
  deductibleTableIndex = 0
  maximumOutOfPocketTableIndex = 0
  deductibleFamilyIndex = 0
  deductibleIndividualIndex = 0
  deductibleFamilyInNetworkIndex = 0
  outOfPocketIndividualIndex = 0
  outOfPocketFamilyIndex = 0
  let individualDeductibleCost = []
  let familyDeductibleCost = []
  let individualOutOfPocketCost = []
  let familyOutOfPocketCost = []
  hash = {}

  pages.map(async(p) => {
    if (p === 3) {
      const page = await doc.getPage(p)
      let data = await page.getTextContent()
      let items = data.items
      items.map((item, index) => {
        // Get the deductible table in PDF
        if (item.str.includes("You have to meet your")) deductibleTableIndex = index
        if (item.str.includes("pocket limit")) maximumOutOfPocketTableIndex = index
    
        // Get the values from deductible tab
        if (index >= deductibleTableIndex && index <= (deductibleTableIndex + 33)) {
          if (item.str.includes('Individual')) deductibleIndividualIndex = index
          if (item.str.includes('Family')) deductibleFamilyInNetworkIndex = index
    
          if (index >= deductibleIndividualIndex && index <= (deductibleIndividualIndex + 7)) {
            // console.log(item.str)
            if (item.str) individualDeductibleCost.push(item.str)
          }
    
          if (index >= deductibleFamilyInNetworkIndex && index <= (deductibleFamilyInNetworkIndex + 7)) {
            if (item.str) familyDeductibleCost.push(item.str)
          }
        }
    
        // Get Maximum out of pocket cost
        if (index >=  maximumOutOfPocketTableIndex && index <= ( maximumOutOfPocketTableIndex + 33)) {
          if (item.str.includes('Individual')) outOfPocketIndividualIndex = index
          if (item.str.includes('Family')) outOfPocketFamilyIndex = index
    
          if (index >= outOfPocketIndividualIndex && index <= (outOfPocketIndividualIndex + 6)) {
            if (item.str) individualOutOfPocketCost.push(item.str)
          }
    
          if (index >= outOfPocketFamilyIndex && index <= (outOfPocketFamilyIndex + 6)) {
            if (item.str) familyOutOfPocketCost.push(item.str)
          }
        }
    
      })
    
      if (individualDeductibleCost) hash['inNetworkIndividualDeductible'] = individualDeductibleCost.join('').split('Individual')[1].trim().split(' ')[0]
      if (familyDeductibleCost) hash['inNetworkFamilyDeductible'] = familyDeductibleCost.join('').split('Family')[1].trim().split(' ')[0]
      if (individualOutOfPocketCost) hash['inNetworkIndividualOutOfPocketLimit'] = individualOutOfPocketCost.join('').split('Individual')[1].trim().split(' ')[0]
      if (familyOutOfPocketCost) hash['inNetworkFamilyOutOfPocketLimit'] = familyOutOfPocketCost.join('').split('Family')[1].trim().split(' ')[0]
    } else if (p === 5) {

    } else if (p === 6) {
      const page = await doc.getPage(p)
      let data = await page.getTextContent()
      let items = data.items
      items.map((item, index) => {
        console.log(item)
        console.log(index)
        // Get the deductible table in PDF
        if (item.str.includes("You have to meet your")) deductibleTableIndex = index
        if (item.str.includes("pocket limit")) maximumOutOfPocketTableIndex = index
      })
    }
  })
  setTimeout(() => {
    return res.status(200).json({cost: hash})
  }, 1000)
}

app.get('/', (req, res) => {
  res.send('home')
})

app.post('/sbcUpload', uploader.single('sbc'), sbcUpload)
app.post('/sobUpload', uploader.single('sob'), sobUpload)

app.listen(port, () => {
  console.log(`App listening on port:${port}`)
})
