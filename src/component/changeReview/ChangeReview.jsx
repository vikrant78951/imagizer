import React, { useState, useEffect } from 'react'
import './ChangeReview.css'
import { apis } from '../../data/data'
import { useStateContext } from '../../contexts/ContextProvider';
import { OutlineButton } from '../button/Button';
import { grayCheck } from '../../assets/icon/Icon';
import { logoutHelper } from '../../helper/helper';

const ChangeReview = ({ reviewState, keyword, mapping_type_id, imageId, reveiwHandler }) => {

    const { setAuthenticate, openToast, closeToast } = useStateContext()
    const [currentReviewState, setCurrentReviewState] = useState()

    // review click handeler
    const reviewClickHandler = (imageId, review) => {

        console.log('change review to ', review)

        if (review === currentReviewState) {
            return;
        }
        // else if (review == 'good'){
        //     changeReviewed(imageId, review);
        //     return;
        // }

        changeReviewed(imageId, review);
    }



    // change review handeler
    const changeReviewed = async (imageId, option) => {
        openToast('loading', 'Updating review')
        const review = (option === 'good') ? 1 : 2;
        reveiwHandler(option)
        openToast('success', 'Review Updated')
        closeToast(4000);
    }


    // initialize review state 
    useEffect(() => {
        setCurrentReviewState(reviewState)
    }, [reviewState])


    return (
        <>
            <div className='review-3-option'>
                <ul className="review-option-container">

                    <OutlineButton
                        additionalClass={currentReviewState === 'unreviewed' ? 'tertiary' : ''}
                        data-id={imageId}
                        data-option='unreviewed'
                        label={currentReviewState === 'unreviewed' ? 'Unreviewed' : 'Reviewed'}
                        action={() => null}
                        logo={currentReviewState === 'unreviewed' ? false : true}
                        logoSrc={grayCheck}
                        logotype='svg'
                        size='xs'
                    />

                    <OutlineButton
                        additionalClass={currentReviewState === 'good' ? 'secondary' : ''}
                        data-id={imageId}
                        data-option='good'
                        label='Good'
                        action={() => reviewClickHandler(imageId, 'good')}
                        size='xs'
                    />


                    <OutlineButton
                        additionalClass={currentReviewState === 'bad' ? 'primary' : ''}
                        data-id={imageId}
                        data-option='bad'
                        label='Bad'
                        action={() => reviewClickHandler(imageId, 'bad')}
                        size='xs'
                    />

                </ul>
            </div>
        </>
    )
}

export default ChangeReview