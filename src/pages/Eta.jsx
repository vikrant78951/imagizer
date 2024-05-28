import React, { useEffect, useState } from 'react';

import '../assets/styles/eta.css';


import Header from '../component/header/Header';
import PageHeader from '../component/pageheader/PageHeader';
import { SectionContainer, ContentWrapper, WhiteBoard } from '../component/wrapper/Wrapper';
import Toast from '../component/toast/Toast';
import { apis } from '../data/data';
import { LightParagraph } from '../component/typhography/Typography';
import { logoutHelper } from '../helper/helper';
import { Loader } from '../component/loader/Loader';
import { NoProcessFound } from '../component/noresult/NoResult';
import { useStateContext } from '../contexts/ContextProvider';
import { Checkbox } from '../component/forms/FormElements'
import { DropdownMenu } from '../component/dropdown/Dropdown';
import { menu } from '../assets/icon/Icon'
import { createCSV, createZipBy_imageId } from '../helper/helper'
import EtaTableRow from '../component/table/EtaTableRow';


const Eta = () => {
    const initialData = {
        loading: true,
        showTable: false,
        showNoResult: false,
        data: []
    }

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

    const [dataObject, setDataObject] = useState(initialData);
    const { setAuthenticate, openToast, closeToast } = useStateContext()
    const [allSelected, setAllSelected] = useState(false)
    const [selectedCard, setSelectedCard] = useState([])
    const [size, setSize] = useState('250x150');



    // fetch eta's 
    const fetchProcess = async () => {
        const apiHeader = {
            method: 'GET',
            credentials: 'include',
        }


        // await fetch(apis.downloadImageStatusCheck, apiHeader)
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (data.errorMessage === "invalid_session") {
        //             logoutHelper()
        //             setAuthenticate("false")
        //             openToast("error", 'Invalid Session');
        //             closeToast(4000);
        //         } else if (data.payload && data.payload.length > 0) {
        //             setDataObject(prevData => ({ //update state
        //                 ...prevData,
        //                 loading: false,
        //                 showTable: true,
        //                 showNoResult: false,
        //                 data: data.payload
        //             }));
        //         } else {
        //             setDataObject(prevData => ({ //update state
        //                 ...prevData,
        //                 loading: false,
        //                 showTable: false,
        //                 showNoResult: true,
        //                 data: []
        //             }));
        //         }

        //     })
        //     .catch((error) => {
        //         console.error('Error fetching data:', error);
        //     });

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, 2000);
        })
        setDataObject(prevData => ({ //update state
            ...prevData,
            loading: false,
            showTable: true,
            showNoResult: false,
            data: []
        }));
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
        createZipBy_imageId(selectedCard, size).then((zip) => { // create zip
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
            setSelectedCard(dataObject.data.filter(data => data.status === "COMPLETED"));
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


    // fetch default proces s
    useEffect(() => {
        fetchProcess()
    }, []);





    return (
        <>
            {/* header */}
            <Header />
            <main className='operation-details'>
                <PageHeader title='Download image ETA' />

                {/* page content */}
                <SectionContainer additioalClass='page-content'>
                    <ContentWrapper additioalClass='big-wrapper'>
                        <WhiteBoard>

                            {dataObject.showTable && <table className="table custom-table">
                                <thead>
                                    <tr>
                                        <th className='menu-column'>
                                            {
                                                dataObject.data.length > 0 &&
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
                                            }

                                        </th>
                                        <th><LightParagraph size='s' type='semiBold'>Keyword</LightParagraph></th>
                                        <th><LightParagraph size='s' type='semiBold'>Image url</LightParagraph></th>
                                        <th><LightParagraph size='s' type='semiBold'>Initial Rank</LightParagraph></th>
                                        <th><LightParagraph size='s' type='semiBold'>Status</LightParagraph></th>
                                        <th><LightParagraph size='s' type='semiBold'>Queued At</LightParagraph></th>
                                        <th><LightParagraph size='s' type='semiBold'>ETA</LightParagraph></th>
                                        <th><LightParagraph size='s' type='semiBold'>Current Rank</LightParagraph></th>
                                    </tr>
                                </thead>



                                {(!dataObject.loading && dataObject.showTable) &&
                                    <tbody>
                                        {
                                            dataObject.data.map((process, index) =>
                                                <EtaTableRow
                                                    key={index}
                                                    rowId={index}
                                                    tableData={process}
                                                    selectedCard={selectedCard}
                                                    onRowSelect={handleRowSelect}

                                                />
                                            )
                                        }
                                    </tbody>
                                }

                            </table>

                            }

                            {(dataObject.loading && !dataObject.showTable) && (
                                <Loader />
                            )}

                            {(!dataObject.loading && dataObject.data.length <= 0) && (
                                <NoProcessFound />
                            )}



                        </WhiteBoard>
                    </ContentWrapper>
                </SectionContainer>
            </main>

            {/* toast notification */}
            <Toast />
        </>
    );
};

export default Eta;
