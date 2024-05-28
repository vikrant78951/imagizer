import React, { useEffect, useState } from 'react'
import { MappingCards, DownloadCard, BlockImageCard, EditCard } from './Cards';
import './Card.css'
import { DarkParagraph } from '../typhography/Typography';
import { OutlinePrimaryButton, PrimaryButton } from '../button/Button';
import { createCSV, createZip } from '../../helper/helper';
import { useStateContext } from '../../contexts/ContextProvider';
import EditImage from '../editImage/EditImage';

const CardContainer = ({ additionalClass, type, dataArray, action, btnId, formData }) => {

    // selected card funcitonality 
    const [selectedCard, setSelectedCard] = useState([])
    const { openToast, closeToast } = useStateContext()
    const [selectionMode, setSelectionMode] = useState(false)

    const [showEditImageOverlay, setShowEditImageOverLay] = useState(false)
    const [imageId, setImageId] = useState('')

    const addCard = (data) => { // add card
        if (selectionMode) {
            setSelectedCard(prev => {
                return [
                    ...prev,
                    data
                ]
            })
        }
    }

    const removeCard = (id) => { // remove card
        if (selectionMode) {
            return new Promise((res, rej) => {
                console.log('remove data ', id)
                setSelectedCard(prev => {
                    return prev.filter((item) => item.imageId !== id)
                })
                res()
            })
        }
    }

    const exportCSV = () => { // export card
        createCSV(selectedCard, 'Images').then(blob => {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute("download", 'images');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }

    const exportImages = () => {
        // console.log(selectedCard)
        openToast('loading', 'Exporting Images')
        createZip(selectedCard, formData.size.value).then((zip) => {
            console.log(zip)
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

    const clearAllSelection = () => {
        console.log('cl')
        setSelectionMode(false);
        setSelectedCard([]);
    }



    // control key toggle selection mode 

    const toggleSelection = (e) => {
        // if (e.key === 'Control' || e.key === 'Meta') {

        if (e.key === 'Shift' || e.key === 'Meta') {
            setSelectionMode(prevSelectionMode => {
                // console.log('selectionMode', !prevSelectionMode);
                return !prevSelectionMode;
            });
            if (!selectionMode) {
                setSelectedCard([])
            }
        } else if (e.key === 'Escape') {
            setSelectionMode(false);
            setSelectedCard([]);
        }

    };

    useEffect(() => {
        document.addEventListener('keydown', toggleSelection);
        return () => {
            document.removeEventListener('keydown', toggleSelection);
        };
    }, [dataArray])




    // card for download images page 
    if (type === "map-images") {
        return (
            <div className={`card-container ${additionalClass ? additionalClass : ''}`}>
                {
                    dataArray.map((item, index) => {
                        return (<MappingCards
                            title={item.author}
                            imageId={item.image_id}
                            imageSrc={item.path}
                            mappingFunction={() => action(item.image_id, item.path)}
                            key={index}
                            btnId={btnId}
                        />)
                    })
                }
            </div>
        );
    }
    // card for download images page 
    if (type === "block-image") {
        return (
            <div className={`card-container ${additionalClass ? additionalClass : ''}`}>
                {
                    dataArray.map((item, index) => {
                        return (<BlockImageCard
                            key={index}
                            imageId={item.original_image_id}
                            imageSrc={item.path}
                            action={action}
                        />)
                    })
                }
            </div>
        );
    }

    // card for download images page 
    if (type === "download-image") {



        return (<>

            <div className={`card-container ${selectionMode ? 'selection-mode' : ''}  ${additionalClass ? additionalClass : ''}`}>
                {
                    dataArray.map((item, index) => {
                        return (<DownloadCard
                            data={item}
                            title={item.author}
                            imageId={item.image_id}
                            imageSrc={item.path}
                            key={index}
                            btnId={btnId}
                            formData={formData}
                            addCard={addCard}
                            removeCard={removeCard}
                            selectionMode={selectionMode}
                            selectedCard={selectedCard}
                        />)
                    })
                }

            </div>



            <div className={`export-overlay ${selectionMode ? 'show' : 'hide'}`}>
                <div className="wrapper">
                    <DarkParagraph size='s'>
                        Selected Images <span className='strong bold'>{selectedCard.length}</span>
                    </DarkParagraph>
                    <div className='btn-group'>
                        <OutlinePrimaryButton
                            additionalClass='default-radius'
                            size='s'
                            action={clearAllSelection}
                            label="Close"
                            disable={false}
                        />

                        <PrimaryButton
                            size='s'
                            action={exportCSV}
                            label="Export CSV"
                            disable={selectedCard.length <= 0 ? true : false}
                        />
                        <PrimaryButton
                            size='s'
                            action={exportImages}
                            label="Export Zip"
                            disable={selectedCard.length <= 0 ? true : false}

                        />

                    </div>
                </div>
            </div>

        </>
        );
    }

    // card for download images page 
    if (type === "edit-image") {

        return (<>

            <div className={`card-container ${selectionMode ? 'selection-mode' : ''}  ${additionalClass ? additionalClass : ''}`}>
                {
                    dataArray.map((item, index) => {
                        return (<EditCard
                            title={item.author}
                            imageId={item.image_id}
                            imageSrc={item.path}
                            key={index}
                            btnId={btnId}
                            formData={formData}
                            addCard={addCard}
                            removeCard={removeCard}
                            selectionMode={selectionMode}
                            selectedCard={selectedCard}
                            setImageId={setImageId}
                            setShowEditImageOverLay={setShowEditImageOverLay}
                        />)
                    })
                }

            </div>


            {/* export layer  */}
            <div className={`export-overlay ${selectionMode ? 'show' : 'hide'}`}>
                <div className="wrapper">
                    <DarkParagraph size='s'>
                        Selected Images <span className='strong bold'>{selectedCard.length}</span>
                    </DarkParagraph>
                    <div className='btn-group'>
                        <OutlinePrimaryButton
                            additionalClass='default-radius'
                            size='s'
                            action={clearAllSelection}
                            label="Close"
                            disable={false}
                        />

                        <PrimaryButton
                            size='s'
                            action={exportCSV}
                            label="Export CSV"
                            disable={selectedCard.length <= 0 ? true : false}
                        />
                        <PrimaryButton
                            size='s'
                            action={exportImages}
                            label="Export Zip"
                            disable={selectedCard.length <= 0 ? true : false}

                        />

                    </div>
                </div>
            </div>

            {
                showEditImageOverlay
                && <EditImage
                    additionalClass=''
                    imageId={imageId}
                    close={() => setShowEditImageOverLay(false)}
                />
            }


        </>
        );
    }





}

export default CardContainer