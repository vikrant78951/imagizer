import React, { useState, useRef, useEffect } from 'react';
import './EditImage.css';
import 'react-image-crop/dist/ReactCrop.css';
import { PrimaryButton } from '../button/Button';
import { downloadIconWhite } from '../../assets/icon/Icon';
import ReactCrop from 'react-image-crop';
import { canvasPreview } from '../../assets/dependency/canvasPreview.ts';
import { useDebounceEffect } from '../../assets/dependency/useDebounceEffect.ts';
import { Title, LightParagraph } from '../typhography/Typography';
import { ImageSize, apis } from '../../data/data';
import { IconButton } from '../button/Button'
import { cross } from '../../assets/icon/Icon'
import { Loader } from '../loader/Loader';
import { NoProcessFound } from '../noresult/NoResult';
import Resizer from "react-image-file-resizer";




import { Input } from '../../component/forms/FormElements'
import { inputsField, errorField, errorMessagefield, updateData, validationField } from '../../component/forms/Validation'




const EditImage = ({ additionalClass, close, imageId }) => {

    const tabdata = [
        {
            label: 'Crop',
            value: 'crop'
        },
        {
            label: 'Resize',
            value: 'resize'
        }
    ]

    // refs 
    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);
    const hiddenAnchorRef = useRef(null);
    const blobUrlRef = useRef('');

    // form data 
    const [field, setFields] = useState(inputsField);
    const [fielderror, setError] = useState(errorField);
    const [errorMessage, setErrorMessage] = useState(errorMessagefield);

    // files 
    const [imageFile, setImageFile] = useState('');
    const [imgSrc, setImgSrc] = useState('');

    // loader and error 
    const [cropImageLoader, setCropImageLoader] = useState(true);
    const [resizeImageLoader, setResizeImageLoader] = useState(true);
    const [cropImageError, setCropImageError] = useState(false);
    const [resizeImageError, setResizeImageError] = useState(false);

    // croped and resized data 
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 250, height: 150, unit: 'px' });
    const [completedCrop, setCompletedCrop] = useState();
    const [resizedImage, setResizedImage] = useState()


    // tab and other select 
    const [activeIndex, setActiveIndex] = useState(0); // active size
    const [selectedTab, setSelectedTab] = useState(tabdata[0]) // active tab 
    const [resizeLock, setResizeLock] = useState(true); // enable and disable resize crop option
    const [selectedSize, setSelectedSize] = useState({ width: 250, height: 150 }) //default size 

    useEffect(() => {
        // 2934009
        let url =  `/upstock.jpg`

        let file = getfile(url).then(data => {
            setImageFile(data) // image blob

            const filename = 'image';
            const file = new File([data], filename);
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || '')
            );
            setImgSrc(reader.readAsDataURL(file)) //set image as a data url 

            // set preview of resized images 
            resizeFile(data, selectedSize.width, selectedSize.height).then(image => {
                setResizedImage(image)
            })

        })

    }, [imageId]);



    // handle tab click 
    const tabHandler = async (item) => {
        setSelectedTab(item)
        console.log(item.value)
        if (item.value == 'resize') {

        } else {

        }

    }

    //input handler 
    const inputHandler = (e) => {
        let field = e.target.name
        let value = e.target.value
        switch (field) {
            case 'width': {
                updateData('width', value, setFields)
            }
                break;
            case 'height': {
                updateData('height', value, setFields)
            }
                break;
            default: { console.log('unknown field') }
        }
        validationField(field, value, setError, setErrorMessage)
    }

    // set size on enter 
    const keyPressHandler = (a) => {
        if (a) {
            if (selectedTab.value === 'crop') {
                if (field.height && field.height && Number(field.height) > 0 && Number(field.width) > 0) {
                    console.log('updating crop size')
                    setCrop({ x: 0, y: 0, width: field.width, height: field.height, unit: 'px' }) //set crop size 
                    setCompletedCrop({ x: 0, y: 0, width: field.width, height: field.height, unit: 'px' }) //set preview
                    setResizeLock(false) // set resizeable false
                }
            } else {
                if (field.height && field.height && Number(field.height) > 0 && Number(field.width) > 0) {
                    // call reszie with height and width 
                    resizeFile(imageFile, field.width, field.height).then(data => setResizedImage(data))
                }
            }

        }
    }

    // update size on click 
    function updateSize(s, index) {
        let newSize = parseSize(s)
        setActiveIndex(index); // set selected size active
        if (selectedTab.value === 'crop') {
            // crop 
            console.log(parseSize(s))
            setCrop({ x: 0, y: 0, width: newSize.width, height: newSize.height, unit: 'px' }) //set crop size 
            updateData('width', newSize.width, setFields)
            updateData('height', newSize.height, setFields)
            setCompletedCrop({ x: 0, y: 0, width: newSize.width, height: newSize.height, unit: 'px' })
            setResizeLock(true)
        } else {
            // resize
            resizeFile(imageFile, newSize.width, newSize.height).then(data => setResizedImage(data))
        }

    }

    // on resize of crop element 
    const onCropChange = (c) => {
        setCrop(c)
        updateData('width', c.width, setFields);
        updateData('height', c.height, setFields);
        setSelectedSize({ width: c.width, height: c.height })

        // set preview of resized images 
        resizeFile(imageFile, c.width, c.height).then(image => {
            setResizedImage(image)
        })

    }


    // close popup 
    const closePopup = () => close();

    // set default crop size 
    function onImageLoad(e) {
        setCompletedCrop(crop)
        setCropImageLoader(false)
    }

    // set preview canvas
    function cropComplete(c) {
        setCompletedCrop(c)
    }

    // get seperated size helper 
    function parseSize(sizeString) { // convert size in object 
        const [width, height] = sizeString.split('x').map(Number);
        return { width, height };
    }

    // get file helper 
    const getfile = async (url) => {
        return new Promise(resolve => {
            fetch(url, {
                method: 'GET',
                credentials: 'include',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    resolve(blob)
                }).catch(err => {
                    console.log('Error:', err);
                    resolve(false)
                });
        })
    }

    // resize file helper 
    const resizeFile = (file, width, height) => {
        // console.log('resizing ', width, 'x', height)
        setResizeImageLoader(true)
        return new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                width,
                height,
                "JPEG",
                100,
                0,
                (uri) => {
                    // console.log(uri)
                    setResizeImageLoader(false)
                    resolve(uri);
                },
                "base64",
                width,
            );
        });
    }

    // download image helper  
    async function onDownloadCropClick() {
        if (selectedTab.value === 'crop') {
            const image = imgRef.current;
            const previewCanvas = previewCanvasRef.current;
            if (!image || !previewCanvas || !completedCrop) {
                throw new Error('Crop canvas does not exist');
            }

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            const offscreen = new OffscreenCanvas(
                completedCrop.width * scaleX,
                completedCrop.height * scaleY
            );
            const ctx = offscreen.getContext('2d');
            if (!ctx) {
                throw new Error('No 2d context');
            }

            ctx.drawImage(
                previewCanvas,
                0,
                0,
                previewCanvas.width,
                previewCanvas.height,
                0,
                0,
                offscreen.width,
                offscreen.height
            );

            const blob = await offscreen.convertToBlob({
                type: 'image/png',
            });

            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
            }
            blobUrlRef.current = URL.createObjectURL(blob);
            hiddenAnchorRef.current.href = blobUrlRef.current;
            hiddenAnchorRef.current.click();
        } else {
            hiddenAnchorRef.current.href = resizedImage;
            hiddenAnchorRef.current.download = 'image.jpg';
            hiddenAnchorRef.current.click();
        }
    }

    // debounse on rescale crop 
    useDebounceEffect(
        async () => {
            if (completedCrop && imgRef.current && previewCanvasRef.current) {
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                );
            }
        },
        100,
        [completedCrop]
    );



    return (
        <div className={`popup screen-size edit-image-popup ${additionalClass ? additionalClass : ''}`}>
            <div className="popup-content">
                {/* close button */}
                <IconButton
                    additionalClass='close-popup'
                    logoType='svg'
                    logoSrc={cross}
                    action={closePopup}
                />

                {/* images  */}
                <div className="left-section">

                    {
                        selectedTab.value === 'crop' ? <div className="image-container">

                            <ReactCrop
                                crop={crop}
                                onChange={onCropChange}
                                onComplete={(c) => cropComplete(c)}
                                locked={false}
                                className={`cropingImage ${cropImageLoader ? 'loading' : 'loaded'}`}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    className={`cropingImage ${cropImageLoader ? 'loading' : 'loaded'}`}
                                />
                            </ReactCrop>

                            {cropImageLoader && !cropImageError && <Loader />}

                            {cropImageError && <NoProcessFound />}


                        </div> : <div className="image-container">

                            {resizeImageLoader && !resizeImageError && <Loader />}
                            {resizeImageError && <NoProcessFound />}
                            {!resizeImageLoader && !resizeImageError && <img src={resizedImage} alt="images" />}


                        </div>
                    }
                </div>

                {/* actions  */}
                <div className="right-section">
                    <div className="sizing">

                        {/* tabs  */}
                        <ul className="tab-container">
                            {
                                tabdata.map((item, index) => (
                                    <li key={index} onClick={() => tabHandler(item)} className={`tab-link ${item.value === selectedTab.value ? 'active' : ''} `}>
                                        {item.label}
                                    </li>
                                ))
                            }
                        </ul>

                        {/* default size  */}
                        <ul className="size-list">

                            {ImageSize.map((size, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <li key={index} className={`${isActive ? 'active' : ''}`} onClick={() => updateSize(size.value, index)} >
                                        <LightParagraph size='s'>{size.value}</LightParagraph>
                                    </li>
                                );
                            })}



                        </ul>

                        {/* custom width  */}
                        <form className="form horizontal-gap-layout">
                            <Title size='xs'>Custom size</Title>
                            <div className="form-row">
                                <Input
                                    additionalClass="sm"
                                    id="width_id"
                                    name="width"
                                    errorId="width_id"
                                    error={false}
                                    errorMessage={''}
                                    type="text"
                                    label={false}
                                    placeholder="Width"
                                    required={true}
                                    value={field.width}
                                    inputHandler={inputHandler}
                                    keyPressHandler={keyPressHandler}
                                    disable={false}
                                />
                                <Input
                                    additionalClass="sm"
                                    id="height_id"
                                    name="height"
                                    errorId="height_id"
                                    error={false}
                                    errorMessage={''}
                                    type="text"
                                    label={false}
                                    placeholder="Height"
                                    required={true}
                                    value={field.height}
                                    inputHandler={inputHandler}
                                    keyPressHandler={keyPressHandler}
                                    disable={false}
                                />
                            </div>
                        </form>

                    </div>

                    {
                        selectedTab.value === 'crop' && <div className="preview-container">
                            <canvas
                                className='preview'
                                ref={previewCanvasRef}
                            />
                        </div>
                    }
                    <div className="download-button-container">

                        {!!completedCrop && (
                            <>
                                <PrimaryButton
                                    size='m'
                                    label='Download'
                                    logoType='icon'
                                    logo={true}
                                    logoSrc={downloadIconWhite}
                                    action={onDownloadCropClick}
                                />
                                <a className='hidden-button'
                                    href="#hidden"
                                    ref={hiddenAnchorRef}
                                    download
                                >
                                    Hidden download
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditImage;
