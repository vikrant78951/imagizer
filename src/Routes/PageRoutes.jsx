import React from 'react'
import { Routes, Route, useParams } from "react-router-dom";

import { useStateContext } from '../contexts/ContextProvider';

import Login from '../pages/Login';
import MapAndReview from '../pages/MapAndReview';
import DownloadImages from '../pages/DownloadImages';
import ResizeNHost from '../pages/ResizeNHost';
import BlockImage from '../pages/BlockImage'
import FileUploadPage from '../pages/FileUploadPage';
import ImageUpload from '../pages/ImageUpload';
import ManagePattern from '../pages/ManagePattern';
import BulkMapping from '../pages/BulkMapping';
import Eta from '../pages/Eta';
import Demo from '../pages/Demo';

const PageRoute = () => {

    const { authenticate } = useStateContext()

    return (
        <Routes>

            {
                (authenticate == "true") ?
                    <>
                        <Route path="image-library" element={<DownloadImages />} />
                        <Route path="resize-image" element={<ResizeNHost />} />
                        <Route path="block-keyword-and-images" element={<BlockImage />} />
                        <Route path="file-upload" element={<FileUploadPage />} />
                        <Route path="image-upload" element={<ImageUpload />} />
                        <Route path="manage-pattern" element={<ManagePattern />} />
                        <Route path="bulk-mapping" element={<BulkMapping />} />
                        <Route path="eta" element={<Eta />} />
                        <Route path="custom-croping" element={<Demo />} />

                        {/* redirect to default page if user is authenticate */}
                        <Route path="*" element={<MapAndReview />} />


                    </>
                    : <Route path="*" element={<Login />} /> // redirect to login if user is not authenticate

            }

        </Routes>
    )
}

export default PageRoute