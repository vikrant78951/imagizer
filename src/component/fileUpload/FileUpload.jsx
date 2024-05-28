import React, { useEffect, useRef } from 'react'
import './FileUpload.css'
import { fileNameShortner } from '../../helper/helper';
import { fileUploadIcon, validFile, invalidFile, cross } from '../../assets/icon/Icon';


const FileUpload = ({ uploadedFilesTemp, setUploadedFilesTemp, supportedFile, multiple }) => {

    const fileContainer = useRef(null);
    const fileInput = useRef(null);

    // drag functionality 
    const handleDragOver = (event) => { // add effect when user drag file in input box
        event.preventDefault();
        fileContainer.current.classList.add('draging')
    }

    const handleDragLeave = (event) => { // remove effect when user drag file in input box
        event.preventDefault();
        fileContainer.current.classList.remove('draging')
    }

    const handleDrop = (event) => {  // pass data to file handler when user drop files
        event.preventDefault();
        fileContainer.current.classList.remove('draging')
        const files = event.dataTransfer.files;
        handleFiles(files);
    }

    const handleFileSelect = (event) => { // pass data to file handler when user select files
        const files = event.target.files;
        handleFiles(files);
    };


    // handler file after upload 
    const handleFiles = (files) => { // bind files state

        Array.from(files).forEach((file, index) => {
            const newUploadedFile = {
                id: uploadedFilesTemp.length + index,
                file: file,
                name: file.name,
                shortName: fileNameShortner(file.name, 8),
                extension: file.type,
                size: file.size / 1024,
                validType: file.type.startsWith(supportedFile),
            };

            if (multiple) {
                setUploadedFilesTemp((prev) => [...prev, newUploadedFile]);

            } else {
                setUploadedFilesTemp([newUploadedFile]);
            }

        });

    };




    // remove file on click 
    const handleRemoveFile = (id) => {
        setUploadedFilesTemp((prevUploadedFilesTemp) => {
            const updatedFiles = [...prevUploadedFilesTemp];
            updatedFiles.splice(id, 1); // Remove the file from the array

            // Rearrange the IDs of the remaining files
            const rearrangedFiles = updatedFiles.map((file, i) => {
                return {
                    ...file,
                    id: i // Update the ID to the new index
                };
            });

            return rearrangedFiles;
        });
    };



    useEffect(() => {
        if (uploadedFilesTemp.length <= 0) {
            fileInput.current.value = ''
        }
    }, [uploadedFilesTemp])


    return (
        <div className="upload-file-wrapper">
            <label htmlFor="file"
                className={`upload-file-container ${uploadedFilesTemp.length > 0 ? 'file-uploaded' : ''}`}
                ref={fileContainer}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >

                {/* choose file description  */}
                {
                    !uploadedFilesTemp.length > 0 && <div className="choose-file">
                        <span className="icon">
                            {fileUploadIcon}
                        </span>
                        <p className='title'> <span>Click to upload</span>  or drag and drop </p>
                        <p className='para'> Maximum file size 25 MB.</p>
                    </div>
                }


                {/* uploaded file card  */}
                {
                    uploadedFilesTemp.length > 0 && <div className="uploaded-files-container">
                        {
                            uploadedFilesTemp.map(files => {
                                const { id, shortName, size, validType } = files;

                                return <div className="file-card" key={id} onClick={(e) => e.preventDefault()}>
                                    <div className="validity">

                                        {
                                            validType ?
                                                <p className="valid-file ">
                                                    <span className="icon">{validFile} </span>
                                                    <span>{shortName}</span>
                                                </p>
                                                : <p className="inValid-file ">
                                                    <span className="icon">{invalidFile} </span>
                                                    <span>{shortName}</span>
                                                </p>
                                        }

                                    </div>
                                    <div className="file-details">
                                        <p className="file-name "> {validType ? ' Valid file' : 'InvalidFile'} </p>
                                        <p className="file-size"> {size.toFixed(2)} <span className="size-unit">KB</span> </p>
                                    </div>
                                    <button className='btn' type="button" onClick={() => handleRemoveFile(id)}>{cross}</button>
                                </div>
                            })
                        }
                    </div>
                }

            </label>
            <input type="file"
                name="file"
                id="file"
                onChange={handleFileSelect}
                hidden
                multiple={multiple}
                ref={fileInput}
            />

        </div>
    )
}

export default FileUpload