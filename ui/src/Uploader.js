import React, { useState } from "react";
import axios from 'axios';

export default function Uploader() {
  const [pbtOptions, setPBTOptions] = useState([])
  const [pbtFile, setPBTFile] = useState()
  const [pbtTableData, setPbtTableData] = useState()
  const [sbcTableData, setSBCTableData] = useState()
  const [sobTableData, setSOBTableData] = useState()
  const [selectedPBT, setSelectedPBT] = useState()
  const [pbtLoading, setPBTLoading] = useState(false)
  const [showPBTLoad, setShowPBTLoad] = useState(false)
  const uploadPBT = (event) => {
    setPBTLoading(true)
    setShowPBTLoad(true)
    const input = event.target.files[0];
    let data = new FormData()

    data.append('file', input)

    setPBTFile(input)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3001/plan_names',
      data : data
    };
    
    axios.request(config)
      .then((response) => {
        setPBTOptions(response.data)
        setPBTLoading(false)
        setShowPBTLoad(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const uploadSOB = (event) => {
    const input = event.target.files[0];
    let data = new FormData()

    data.append('file', input)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3001/sob',
      data : data
    };

    axios.request(config)
      .then((response) => {
        setSOBTableData(response.data.data)
        compareValues()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const uploadSBC = (event) => {
    const input = event.target.files[0];
    let data = new FormData()

    data.append('file', input)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3001/sbc',
      data : data
    };

    axios.request(config)
      .then((response) => {
        setSBCTableData(response.data.data)
        compareValues()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const selectPlan = (e) => {
    const pbtOption = pbtOptions.find(pbt => pbt.key === e.target.value)
    setSelectedPBT(pbtOption)

    let data = new FormData()

    data.append('plan_name', pbtOption.plan_name);
    data.append('sheet_name', pbtOption.sheet_name);
    data.append('file', pbtFile);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:3001/pbt_data',
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      setPbtTableData(response.data.data)
      compareValues()
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const formatKey = (val) => {
    return val.replaceAll(' ', '_').toLowerCase()
  }

  const formatValue = (val) => {
    if (!val || val === 'nan') {
      return ''
    }
  }

  const compareValues = () => {
    setTimeout(() => {
      const pbtOOPInNetInd = document.getElementById('pbt-0-oop-in_network');
      const pbtOOPInNetFam = document.getElementById('pbt-1-oop-in_network');
      const pbtOOPInNetIndTier2 = document.getElementById('pbt-0-oop-in_network_(tier_2)');
      const pbtOOPInNetFamTier2 = document.getElementById('pbt-1-oop-in_network_(tier_2)');
      const pbtOOPOONetInd = document.getElementById('pbt-0-oop-out_of_network');
      const pbtOOPOONetFam = document.getElementById('pbt-1-oop-out_of_network');
      const pbtOOPComInOutNetInd = document.getElementById('pbt-0-oop-combined_in/out_network');
      const pbtOOPComInOutNetFam = document.getElementById('pbt-1-oop-combined_in/out_network');

      const sobOOPInNetInd = document.getElementById('sob-0-oop-in_network');
      const sobOOPInNetFam = document.getElementById('sob-1-oop-in_network');
      const sobOOPInNetIndTier2 = document.getElementById('sob-0-oop-in_network_(tier_2)');
      const sobOOPInNetFamTier2 = document.getElementById('sob-1-oop-in_network_(tier_2)');
      const sobOOPOONetInd = document.getElementById('sob-0-oop-out_of_network');
      const sobOOPOONetFam = document.getElementById('sob-1-oop-out_of_network');
      const sobOOPComInOutNetInd = document.getElementById('sob-0-oop-combined_in/out_network');
      const sobOOPComInOutNetFam = document.getElementById('sob-1-oop-combined_in/out_network');

      const sbcOOPInNetInd = document.getElementById('sbc-0-oop-in_network');
      const sbcOOPInNetFam = document.getElementById('sbc-1-oop-in_network');
      const sbcOOPInNetIndTier2 = document.getElementById('sbc-0-oop-in_network_(tier_2)');
      const sbcOOPInNetFamTier2 = document.getElementById('sbc-1-oop-in_network_(tier_2)');
      const sbcOOPOONetInd = document.getElementById('sbc-0-oop-out_of_network');
      const sbcOOPOONetFam = document.getElementById('sbc-1-oop-out_of_network');
      const sbcOOPComInOutNetInd = document.getElementById('sbc-0-oop-combined_in/out_network');
      const sbcOOPComInOutNetFam = document.getElementById('sbc-1-oop-combined_in/out_network');
      // Checks In Net Max OOP
      if (pbtOOPInNetInd?.innerHTML && sobOOPInNetInd?.innerHTML && sbcOOPInNetInd?.innerHTML) {
        // Ind
        if (sobOOPInNetInd?.innerHTML !== pbtOOPInNetInd?.innerHTML) {
          document.getElementsByClassName('sob-0-oop-in_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sob-0-oop-in_network')[0]?.classList.remove('table-danger')
        }

        if (sbcOOPInNetInd?.innerHTML !== pbtOOPInNetInd?.innerHTML) {
          document.getElementsByClassName('sbc-0-oop-in_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sbc-0-oop-in_network')[0]?.classList.remove('table-danger')
        }
        // Fam
        if (sobOOPInNetFam?.innerHTML !== pbtOOPInNetFam?.innerHTML) {
          document.getElementsByClassName('sob-1-oop-in_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sob-1-oop-in_network')[0]?.classList.remove('table-danger')
        }

        if (sbcOOPInNetFam?.innerHTML !== pbtOOPInNetFam?.innerHTML) {
          document.getElementsByClassName('sbc-1-oop-in_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sbc-1-oop-in_network')[0]?.classList.remove('table-danger')
        }
      }
      // Checks In Net Tier 2 Max OOP
      if (true) {
        // Ind
        if (sobOOPInNetIndTier2?.innerHTML !== pbtOOPInNetIndTier2?.innerHTML) {
          document.getElementsByClassName('sob-0-oop-in_network_(tier_2)')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sob-0-oop-in_network_(tier_2)')[0]?.classList.remove('table-danger')
        }

        if (sbcOOPInNetIndTier2?.innerHTML !== pbtOOPInNetIndTier2?.innerHTML) {
          document.getElementsByClassName('sbc-0-oop-in_network_(tier_2)')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sbc-0-oop-in_network_(tier_2)')[0]?.classList.remove('table-danger')
        }
        // Fam
        if (sobOOPInNetFamTier2?.innerHTML !== pbtOOPInNetFamTier2?.innerHTML) {
          document.getElementsByClassName('sob-1-oop-in_network_(tier_2)')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sob-1-oop-in_network_(tier_2)')[0]?.classList.remove('table-danger')
        }

        if (sbcOOPInNetFamTier2?.innerHTML !== pbtOOPInNetFamTier2?.innerHTML) {
          document.getElementsByClassName('sbc-1-oop-in_network_(tier_2)')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sbc-1-oop-in_network_(tier_2)')[0]?.classList.remove('table-danger')
        }
      }
      // Checks Out of net Max OOP
      if (true) {
        // Ind
        if (sobOOPOONetInd?.innerHTML !== pbtOOPOONetInd?.innerHTML) {
          document.getElementsByClassName('sob-0-oop-in_network_(tier_2)')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sob-0-oop-in_network_(tier_2)')[0]?.classList.remove('table-danger')
        }

        if (sbcOOPOONetInd?.innerHTML !== pbtOOPOONetInd?.innerHTML) {
          document.getElementsByClassName('sbc-0-oop-out_of_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sbc-0-oop-out_of_network')[0]?.classList.remove('table-danger')
        }
        // Fam
        if (sobOOPOONetFam?.innerHTML !== pbtOOPOONetFam?.innerHTML) {
          document.getElementsByClassName('sob-1-oop-out_of_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sob-1-oop-out_of_network')[0]?.classList.remove('table-danger')
        }

        if (sbcOOPOONetFam?.innerHTML !== pbtOOPOONetFam?.innerHTML) {
          document.getElementsByClassName('sbc-1-oop-out_of_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sbc-1-oop-out_of_network')[0]?.classList.remove('table-danger')
        }
      }
      // Checks Combined In/Out of net Max OOP
      if (true) {
        // Ind
        if (sobOOPComInOutNetInd?.innerHTML !== pbtOOPComInOutNetInd?.innerHTML) {
          document.getElementsByClassName('sob-0-oop-combined_in/out_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sob-0-oop-combined_in/out_network')[0]?.classList.remove('table-danger')
        }

        if (sbcOOPComInOutNetInd?.innerHTML !== pbtOOPComInOutNetInd?.innerHTML) {
          document.getElementsByClassName('sbc-0-oop-combined_in/out_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sbc-0-oop-combined_in/out_network')[0]?.classList.remove('table-danger')
        }
        // Fam
        if (sobOOPComInOutNetFam?.innerHTML !== pbtOOPComInOutNetFam?.innerHTML) {
          document.getElementsByClassName('sob-1-oop-combined_in/out_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sob-1-oop-combined_in/out_network')[0]?.classList.remove('table-danger')
        }

        if (sbcOOPComInOutNetFam?.innerHTML !== pbtOOPComInOutNetFam?.innerHTML) {
          document.getElementsByClassName('sbc-1-oop-combined_in/out_network')[0]?.classList.add('table-danger')
        } else {
          document.getElementsByClassName('sbc-1-oop-combined_in/out_network')[0]?.classList.remove('table-danger')
        }
      }
      
    }, 800)
  }

  return (
    <div className="row">
      <div className="col-4">
        <div className="row">
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label fw-bold">Upload PBT</label>
            <input className="form-control" type="file" id="formFile" onChange={(e) => uploadPBT(e)} />

            { (!pbtLoading && showPBTLoad) &&
              <p className="fw-bolder">... Loading data</p>
            }

            { pbtOptions.length > 0 && 
              <select className="form-select mt-3" aria-label="Default select example" onChange={(e) => selectPlan(e)}>
                <option defaultValue>Select Plan</option>
                { pbtOptions.map(option => <option value={option?.key} key={option?.key}>{option?.plan_name}</option>) }
              </select>
            }

            { pbtTableData &&
              <>
                <form className="form-floating mt-2">
                  <input type="text" className="form-control" id="floatingInputValue" placeholder="name@example.com" defaultValue={selectedPBT.key} />
                  <label htmlFor="floatingInputValue">HIOS Plan ID</label>
                </form>

                <table className="table table-bordered table-hover mt-3">
                  <tbody>
                    { pbtTableData && 
                      pbtTableData.map((data, index) => {
                        return(
                          <>
                            <tr key={index}>
                              <th colSpan={2} style={{backgroundColor: '#007bc4', color: '#fff'}}>{data?.key}</th>
                            </tr>
                            {
                              data.data.map((d, i) => {
                                return(
                                  <>
                                    <tr key={i}>
                                      <th colSpan={2} style={{backgroundColor: '#6c757d', color: '#fff'}}>{d?.key}</th>
                                    </tr>
                                    {
                                      d.data.map((val, ind) => {
                                        return(
                                          <tr key={ind} className={`pbt-${ind}-oop-${formatKey(d?.key)}`}>
                                            <td id={`pbt-${ind}-oop-key`} data-parent-key={d?.key}>{ind === 0 ? 'Individual' : 'Family'}</td>
                                            <td id={`pbt-${ind}-oop-${formatKey(d?.key)}`} data-parent-key={d?.key}>{ind === 0 ? val['Individual']: val['Family']}</td>
                                          </tr>
                                        )
                                      })
                                    }
                                  </>
                                )
                              })
                            }
                          </>
                        )
                      })
                    }
                  </tbody>
                </table>
              </>
            }
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="row">
        <div className="mb-3">
              <label htmlFor="formFile" className="form-label fw-bold">Upload SOB</label>
              <input className="form-control" type="file" id="formFile" onChange={(e) => uploadSOB(e)} accept="application/pdf" />
              { sobTableData &&
                  <table className="table table-bordered table-hover" style={{marginTop: '135px'}}>
                    <tbody>
                    { sobTableData && 
                      sobTableData.map((data, index) => {
                        return(
                          <>
                            <tr key={index}>
                              <th colSpan={2} style={{backgroundColor: '#007bc4', color: '#fff'}}>{data?.key}</th>
                            </tr>
                            {
                              data.data.map((d, i) => {
                                return(
                                  <>
                                    <tr key={i}>
                                      <th colSpan={2} style={{backgroundColor: '#6c757d', color: '#fff'}}>{d?.key}</th>
                                    </tr>
                                    {
                                      d.data.map((val, ind) => {
                                        return(
                                          <tr key={ind} className={`sob-${ind}-oop-${formatKey(d?.key)}`}>
                                            <td id={`sob-${ind}-oop-key`} data-parent-key={d?.key}>{ind === 0 ? 'Individual' : 'Family'}</td>
                                            <td id={`sob-${ind}-oop-${formatKey(d?.key)}`} data-parent-key={d?.key}>{ind === 0 ? val['Individual']: val['Family']}</td>
                                          </tr>
                                        )
                                      })
                                    }
                                  </>
                                )
                              })
                            }
                          </>
                        )
                      })
                    }
                  </tbody>
                  </table>
              }
            </div>
        </div>
      </div>
      <div className="col-4">
        <div className="row">
            <div className="mb-3">
              <label htmlFor="formFile" className="form-label fw-bold">Upload SBC</label>
              <input className="form-control" type="file" id="formFile" onChange={(e) => uploadSBC(e)} accept="application/pdf" />
              { sbcTableData &&
                  <table className="table table-bordered table-hover" style={{marginTop: '135px'}}>
                    <tbody>
                    { sbcTableData && 
                      sbcTableData.map((data, index) => {
                        return(
                          <>
                            <tr key={index}>
                              <th colSpan={2} style={{backgroundColor: '#007bc4', color: '#fff'}}>{data?.key}</th>
                            </tr>
                            {
                              data.data.map((d, i) => {
                                return(
                                  <>
                                    <tr key={i}>
                                      <th colSpan={2} style={{backgroundColor: '#6c757d', color: '#fff'}}>{d?.key}</th>
                                    </tr>
                                    {
                                      d.data.map((val, ind) => {
                                        return(
                                          <tr key={ind} className={`sbc-${ind}-oop-${formatKey(d?.key)}`}>
                                            <td id={`sbc-${ind}-oop-key`} data-parent-key={d?.key}>{ind === 0 ? 'Individual' : 'Family'}</td>
                                            <td id={`sbc-${ind}-oop-${formatKey(d?.key)}`} data-parent-key={d?.key}>{ind === 0 ? val['Individual']: val['Family']}</td>
                                          </tr>
                                        )
                                      })
                                    }
                                  </>
                                )
                              })
                            }
                          </>
                        )
                      })
                    }
                  </tbody>
                  </table>
              }
            </div>
          </div>
      </div>
    </div>
  )
}