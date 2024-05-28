import React, { useState, useEffect } from 'react'
import '../assets/styles/fileUpload.css'
import Header from '../component/header/Header'
import Toast from '../component/toast/Toast'
import PageHeader from '../component/pageheader/PageHeader'
import FileUpload from '../component/fileUpload/FileUpload'
import { SectionContainer, ContentWrapper, WhiteBoard } from '../component/wrapper/Wrapper'
import { apis } from '../data/data'
import { PrimaryButton, SecondaryButton } from '../component/button/Button'
import FileDemo from '../component/fileDemo/FileDemo'
import { LightParagraph, Title } from '../component/typhography/Typography'
import { filterFile, logoutHelper } from '../helper/helper'
import { useStateContext } from '../contexts/ContextProvider'
import doemoFile from '../assets/files/bulkMapping.csv'
import { Checkbox } from '../component/forms/FormElements'
import { DropdownMenu } from '../component/dropdown/Dropdown';
import { menu } from '../assets/icon/Icon'
import { createCSV, createZipById } from '../helper/helper'
import BulkMappingTableRow from '../component/table/BulkMappingTableRow'

const BulkMapping = () => {

    const submenu = [
        {
            id: 2,
            title: 'Export CSV',
            value: 'csv',
            logo: false,
        },
        {
            id: 2,
            title: 'Export Images Zip',
            value: 'zip',
            logo: false,
        },
    ]

    const [uploadedFilesTemp, setUploadedFilesTemp] = useState([])
    const { openToast, closeToast, team, setAuthenticate } = useStateContext();
    const [fileError, setFileError] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState('')
    const [table, showtable] = useState(false)
    const [tableData, setTableData] = useState([])

    const [allSelected, setAllSelected] = useState(false)
    const [selectedCard, setSelectedCard] = useState([])
    const [size, setSize] = useState('250x150');


    useEffect(() => {
        setSelectedTeam(team)
    }, [team])

    // clear files 
    const clearAll = () => {
        setUploadedFilesTemp([])
        setFileError(false)
        showtable(false)
        setAllSelected(false)
        setSelectedCard([])
    }

    // submit Handler 
    const submitHandler = async () => {
        clearAll()
        if (uploadedFilesTemp.length <= 0) {
            setFileError(true)
            showtable(false)
        } else {
            openToast('loading', 'Uploading files...')

            let newArray = filterFile(uploadedFilesTemp)

            setUploadedFilesTemp(newArray)

            if (newArray.length > 0) {
                setFileError(false)

                // Create a new FormData object
                const formData = new FormData();

                newArray.forEach((file) => { // Append uploaded files to the formData object
                    formData.append('fileName', file.file);
                });
                formData.append('mapFromCsv', 1);

                // await fetch(apis.bulkMapping, {
                //     method: 'POST',
                //     body: formData,
                //     credentials: 'include',
                // }).then(async response => {
                //     if (response.ok) {

                //         let result = await response.json();
                //         if (result.errorMessage === "invalid_session") {
                //             logoutHelper()
                //             setAuthenticate("false")
                //             openToast("error", 'Invalid Session');
                //             closeToast(4000);
                //         }
                //         else if (result.response.elements && result.response.elements.length > 0) {
                //             openToast('success', 'File uploaded');
                //             console.log(result.response.elements)
                //             setTableData(result.response.elements)
                //             showtable(true)
                //             closeToast(3000);
                //         } else {
                //             openToast('error', 'something went wrong please try again');
                //             setUploadedFilesTemp([])
                //             setTableData([])
                //             closeToast(3000);
                //             showtable(false)

                //         }
                //     } else {
                //         openToast('error', response.errMessage);
                //         setUploadedFilesTemp([])
                //         closeToast(3000);
                //         showtable(false);
                //         setTableData([])
                //     }


                // })
                //     .catch((error) => {
                //         console.error(error);
                //         setUploadedFilesTemp([])
                //         openToast('error', 'File failed');
                //         closeToast(3000);
                //         showtable(false)
                //         setTableData([])

                //     });

                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve()
                    }, 2000);
                })
                openToast('success', 'Your image will map soon');
                closeToast(4000);

            } else {
                openToast('error', 'No valid file found');
                closeToast(3000);
            }




        }
    }

    // export functionality 
    const exportCSV = () => { // export card
        createCSV(selectedCard).then(blob => {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute("download", 'images');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }

    const exportImages = () => {
        openToast('loading', 'Exporting Images')
        createZipById(selectedCard, tableData).then((zip) => { // create zip
            zip.generateAsync({ type: "blob" }).then((content) => {
                const zipLink = document.createElement("a");
                zipLink.href = URL.createObjectURL(content);
                zipLink.setAttribute("download", "images.zip");
                zipLink.innerHTML = "Download Images ZIP";
                document.body.appendChild(zipLink);
                zipLink.click();
                document.body.removeChild(zipLink);
                openToast('success', 'File Exported')
                closeToast(3000)
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    // selections 
    const checkboxHandler = (event) => {
        const checked = event.target.checked;
        if (checked) {
            setAllSelected(true)
            setSelectedCard(tableData.filter(data => data.status === "True"));
        } else {
            setAllSelected(false)
            setSelectedCard([]);
        }
    }

    const handleRowSelect = (row, checked) => {
        if (checked) {
            setSelectedCard([...selectedCard, row]);
        } else {
            setSelectedCard(selectedCard.filter((selectedRow) => selectedRow !== row));
            setAllSelected(false)
        }
    };

    // dropdown click hanler 
    const exportClickHandler = (value) => {
        if (selectedCard.length <= 0) {
            openToast('error', 'Please select file')
            closeToast(2000)
            return
        }

        if (value === 'csv') {
            exportCSV()
            return
        }

        if (value === 'zip') {
            exportImages()
            return
        }
    }


    return (
        <>
            <Header />
            <main className='file-upload-page bulk-mapping-page'>


                {/* page heaer  */}
                <PageHeader title="Bulk Mapping " />

                <SectionContainer additioalClass='page-content'>
                    <ContentWrapper additioalClass='big-wrapper'>
                        <WhiteBoard>

                            {
                                selectedTeam !== 'MSN' ? <>

                                    {/* description */}
                                    <div className="description">
                                        <LightParagraph size='s'>
                                            Please go through the <a className='link' href="https://docs.google.com/document/d/1vvj3D7x6x84-_ELfWEPYryX8ghDwhrLfXFrYm4Pikbo/edit" target='_blank'>readme</a> for csv format. (Bulk mapping not available for msn domain.)
                                        </LightParagraph>
                                    </div>


                                    <form className="form horizontal-gap-layout">

                                        <div className="form-row"> <div>     </div>  </div>

                                        <div className="upload-file-wrapper">
                                            <Title size='s'>Upload and attach Files</Title>
                                            <FileUpload
                                                uploadedFilesTemp={uploadedFilesTemp}
                                                setUploadedFilesTemp={setUploadedFilesTemp}
                                                supportedFile='text/'
                                                multiple={false}
                                            />

                                        </div>

                                        {/* error  */}

                                        {
                                            fileError && <div className="form-row">
                                                <p className='error-txt'>Please select a file</p>
                                            </div>
                                        }

                                        <div className='button-container'>
                                            <div></div>
                                            <div>
                                                <SecondaryButton
                                                    size='l'
                                                    label='Clear All'
                                                    action={clearAll}
                                                />
                                                <PrimaryButton
                                                    size='l'
                                                    label='Submit File'
                                                    action={submitHandler}
                                                />
                                            </div>
                                        </div>
                                    </form>

                                    {/* file  */}
                                    {table && tableData.length > 0 ?
                                        <table className="table custom-table mt-24">
                                            <thead>
                                                <tr>
                                                    <th className='menu-column'>
                                                        <form className="form horizontal-gap-layout">
                                                            <div className="form-row">
                                                                <Checkbox
                                                                    additionalClass=''
                                                                    id="uploadedImages_at"
                                                                    name="uploadedImages"
                                                                    label={false}
                                                                    inputHandler={checkboxHandler}
                                                                    autoFocus={false}
                                                                    checked={allSelected}
                                                                />
                                                                <DropdownMenu
                                                                    additionalClass='left'
                                                                    submenu={submenu}
                                                                    logo={menu}
                                                                    title={false}
                                                                    type='click'
                                                                    callback={exportClickHandler}
                                                                />
                                                            </div>
                                                        </form>
                                                    </th>
                                                    <th><LightParagraph size='s' type='semiBold'>Keyword</LightParagraph></th>
                                                    <th><LightParagraph size='s' type='semiBold'>Images</LightParagraph></th>
                                                    <th><LightParagraph size='s' type='semiBold'>Shutterstock Id</LightParagraph></th>
                                                    <th><LightParagraph size='s' type='semiBold'>Status</LightParagraph></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    tableData.map((data, index) => {
                                                        return <BulkMappingTableRow
                                                            key={index}
                                                            rowId={index}
                                                            tableData={data}
                                                            selectedCard={selectedCard}
                                                            onRowSelect={handleRowSelect}
                                                        />

                                                    })
                                                }
                                            </tbody>

                                        </table>
                                        : <FileDemo demoFile={doemoFile} />}


                                </> :
                                    <div className="description">
                                        <LightParagraph size='s'>
                                            Bulk mapping not available for MSN domain.
                                        </LightParagraph>
                                    </div>
                            }







                        </WhiteBoard>
                    </ContentWrapper>
                </SectionContainer>


            </main>
            <Toast />
        </>
    )
}

export default BulkMapping