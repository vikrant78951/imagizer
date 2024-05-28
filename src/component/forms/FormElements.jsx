import React, { useEffect, useState } from 'react'
import './Forms.css'
import { LightParagraph } from '../typhography/Typography';
import { readSearch } from '../../assets/icon/Icon';
import { createOption, splitValueBySlashN } from '../../helper/helper';

// react select 
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import { PrimaryButton } from '../button/Button';
const components = {
    DropdownIndicator: null,
};



// input tag 
export const Input = ({ additionalClass, id, name, errorId, error, errorMessage, type, required, value, disable, inputHandler, keyPressHandler, placeholder, label, autoFocus, autoComplete, min }) => {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && keyPressHandler) {
            keyPressHandler(true);
        }
    };

    return (
        <div className={`input-container ${additionalClass ? additionalClass : ''}  ${error ? 'error-true' : ''}`}>
            {
                label && <label htmlFor={id}>
                    <LightParagraph size='s' >
                        {label} {required && <span className="imp">*</span>}
                    </LightParagraph>
                </label>
            }
            <input
                type={type ? type : 'text'}
                id={id ? id : ''}
                name={name}
                required={required ? required : false}
                value={value ? value : ''}
                onChange={inputHandler}
                onKeyPress={handleKeyPress}
                placeholder={placeholder ? placeholder : 'Enter value'}
                disabled={disable ? true : false}
                autoFocus={autoFocus ? autoFocus : false}
                autoComplete={autoComplete ? autoComplete : 'off'}
                min={min ? min : null}
            />
            <p id={errorId} className={`error ${error && 'error-visible'}`} htmlFor={id} >{errorMessage}</p>
        </div>
    )
}


// searchKeywordField 
export const SearchKeyword = ({ keyword, onSubmit, additionalClass, multiple, clearAll, placeholder, callback }) => {

    const [inputValue, setInputValue] = useState()
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)

    useEffect(() => {
        setValue("")
    }, [])

    useEffect(() => {
        // initialize value
        setValue(keyword)
    }, [keyword]);



    useEffect(() => {
        // console.log('value = ', value)
        if (value == '') {
            clearAll(value)
        } else {
            if (callback) {
                callback(value)
            }
        }
    }, [value])




    const handleKeyDown = async (event) => { //handler keydown 
        if (event.key === 'Enter' || event.key === 'Tab') {
            if (inputValue) {
                setValue((prev) => {
                    if (prev && prev.length > 0) {
                        const isDuplicate = prev.some(option => option.value === inputValue);
                        if (!isDuplicate) {
                            return multiple ? [...prev, createOption(inputValue)] : [createOption(inputValue)]
                        } else {
                            return [...prev]
                        }
                    } else {
                        return [createOption(inputValue)]
                    }
                });

                setInputValue('');
                event.preventDefault();
            }
        }
    };


    const handlePaste = (e) => { //handle paste
        e.preventDefault();
        try {
            const pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
            const pastedTextArray = splitValueBySlashN(pastedText)

            setValue(prev => {

                if (prev && prev.length > 0) {
                    let newKeywordSet = []
                    pastedTextArray.map(item => {
                        const isDuplicate = prev.some(option => option.value === item);

                        if (multiple) {
                            if (!isDuplicate) {
                                newKeywordSet.push(createOption(item))
                            }
                        } else {
                            newKeywordSet = [createOption(item)]
                        }

                    })
                    return multiple ? [...prev, ...newKeywordSet] : newKeywordSet;

                } else {
                    let newKeywordSet = []
                    pastedTextArray.map(item => {
                        multiple ? newKeywordSet.push(createOption(item)) : newKeywordSet = [createOption(item)]
                    })
                    return newKeywordSet;
                }

            })

            setInputValue('');
        } catch (error) {
            console.log(error)
        }
    }

    const handleBlur = (event) => { // outside click handler 
        // console.log(event.target)
        const val = event.target.value.trim();
        if (val) {
            setValue((prev) => {
                if (value.length > 0) {
                    const isDuplicate = value.some(option => option.value === val);
                    if (!isDuplicate) {
                        return multiple ? [...prev, createOption(inputValue)] : [createOption(inputValue)]
                    } else {
                        return [...prev]
                    }
                } else {
                    console.log(prev)
                    return [...prev, createOption(inputValue)]
                }
            });

            setInputValue('');
            event.preventDefault();
        }
    }


    useEffect(() => {
        const reactInputs = document.querySelectorAll('#react-multi-inputs');
        reactInputs.forEach(reactC => {
            reactC.addEventListener('paste', handlePaste)
        })
    }, [])


    const submitKeyword = () => { // search  handler 
        if (value.length < 1) setError(true)
        if (value.length < 1) return
        setError(false)
        onSubmit(value)
    }

    return (
        <div className={`search-keword  ${additionalClass ? additionalClass : ''} ${error ? 'red-border' : ''} ${multiple ? 'multiple' : 'single'} `}>
            <span className="search-bar">{readSearch}</span>
            <CreatableSelect
                id='react-multi-inputs'
                components={components}
                inputValue={inputValue}
                value={value}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue) => setValue(newValue)}
                onInputChange={(newValue) => setInputValue(newValue)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={placeholder ? placeholder : 'Search Keywords...'}
            />

            <PrimaryButton
                size='m'
                label="Search"
                action={submitKeyword}
            />

        </div>
    );
};


// searchKeywordField 
export const SingleSearchKeyword = ({ name, additionalClass, defalultValue, placeHolder, onSubmit }) => {

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState(false)

    const onInputChange = (e) => {
        let v = e.target.value
        setInputValue(v);

    }

    const onKeyHandler = (e) => {
        if (e.key === 'Enter') {
            if (inputValue === '') {
                setError(true)
                return
            }
            onSubmit(inputValue)
        }
    }

    const submitForm = () => {
        if (inputValue === '') {
            setError(true)
            return
        }
        onSubmit(inputValue)
    }

    useEffect(() => { // initialize default value
        setInputValue(defalultValue ? defalultValue : '')
    }, [defalultValue])

    useEffect(() => {
        if (inputValue !== '') {
            setError(false)
        }
    }, [inputValue])

    return (
        <div className={`search-keword ${additionalClass ? additionalClass : ''}  ${error ? 'red-border' : ''}   single `}>
            <span className="search-bar">{readSearch}</span>

            <input
                name={name}
                value={inputValue}
                onChange={onInputChange}
                placeholder={placeHolder ? placeHolder : 'Enter Value'}
                onKeyDown={onKeyHandler}
            />


            <PrimaryButton
                size='m'
                label="Search"
                action={submitForm}
            />

        </div>
    );
};

// searchKeywordField 
export const SingleTextInput = ({ name, additionalClass, defalultValue, placeHolder, callback, onSubmit, showError }) => {

    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState(false)

    const onInputChange = (e) => {
        let v = e.target.value
        setInputValue(v);
        if (callback) {
            callback(v)
        }
    }

    const onKeyHandler = (e) => {
        if (e.key === 'Enter') {
            if (inputValue === '') {
                setError(true)
                return
            }
            onSubmit(inputValue)
        }
    }

    useEffect(() => { // initialize default value
        setInputValue(defalultValue ? defalultValue : '')
    }, [defalultValue])

    useEffect(() => {
        if (inputValue !== '') {
            setError(false)
        }
    }, [inputValue])

    useEffect(() => {
        setError(showError)
    }, [showError])

    return (
        <div className={`input-container ${additionalClass ? additionalClass : ''}  ${error ? 'red-border' : ''}   single `}>
            <input
                name={name}
                value={inputValue}
                onChange={onInputChange}
                placeholder={placeHolder ? placeHolder : 'Enter Value'}
                onKeyDown={onKeyHandler}
            />
        </div>
    );
};

// multi inputs 
export const MultiInputs = ({ keyword, onSubmit, additionalClass, multiple, placeholder, callback, errorHandler, inputError }) => {
    const [inputValue, setInputValue] = useState()
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)


    useEffect(() => { // initialize value
        setValue(keyword)
    }, [keyword]);


    useEffect(() => {
        if (callback) {
            callback(value)
        }
    }, [value])

    useEffect(() => {
        setError(inputError)
    }, [inputError])



    useEffect(() => {
        setValue('')

    }, [])


    const handleKeyDown = async (event) => { //handler keydown 
        if (event.key === 'Enter' || event.key === 'Tab') {
            if (inputValue) {
                setValue((prev) => {
                    if (prev && prev.length > 0) {
                        const isDuplicate = prev.some(option => option.value === inputValue);
                        if (!isDuplicate) {
                            return multiple ? [...prev, createOption(inputValue)] : [createOption(inputValue)]
                        } else {
                            return [...prev]
                        }
                    } else {
                        return [createOption(inputValue)]
                    }
                });

                setInputValue('');
                event.preventDefault();
            }
        }
    };

    const handlePaste = (e) => { //handle paste
        e.preventDefault();
        try {
            const pastedText = (e.originalEvent || e).clipboardData.getData('text/plain');
            const pastedTextArray = splitValueBySlashN(pastedText)

            setValue(prev => {

                if (prev && prev.length > 0) {
                    let newKeywordSet = []
                    pastedTextArray.map(item => {
                        const isDuplicate = prev.some(option => option.value === item);

                        if (multiple) {
                            if (!isDuplicate) {
                                newKeywordSet.push(createOption(item))
                            }
                        } else {
                            newKeywordSet = [createOption(item)]
                        }

                    })
                    return multiple ? [...prev, ...newKeywordSet] : newKeywordSet;

                } else {
                    let newKeywordSet = []
                    pastedTextArray.map(item => {
                        multiple ? newKeywordSet.push(createOption(item)) : newKeywordSet = [createOption(item)]
                    })
                    return newKeywordSet;
                }

            })

            setInputValue('');
        } catch (error) {
            console.log(error)
        }
    }

    const handleBlur = (event) => { // outside click handler 
        const val = event.target.value.trim();
        if (val) {
            setValue((prev) => {
                console.log(value)
                if (value.length > 0) {
                    const isDuplicate = value.some(option => option.value === val);
                    if (!isDuplicate) {
                        return multiple ? [...prev, createOption(inputValue)] : [createOption(inputValue)]
                    } else {
                        return [...prev]
                    }
                } else {
                    console.log(prev)
                    if (prev) {
                        return [...prev, createOption(inputValue)]

                    } else {
                        return [createOption(inputValue)]
                    }
                }
            });

            setInputValue('');
            event.preventDefault();
        }
    }


    useEffect(() => {
        const reactInputs = document.querySelectorAll('#react-multi-inputs-2');
        reactInputs.forEach(reactC => {
            reactC.addEventListener('paste', handlePaste)
        })
    }, [])

    const submitKeyword = () => { // search  handler 
        if (value.length < 1) setError(true)
        if (value.length < 1) return
        setError(false)
        onSubmit(value)
    }

    return (
        <div className={`react-select multiselect input-container  ${additionalClass ? additionalClass : ''} ${error ? 'red-border error-true' : ''} ${multiple ? 'multiple' : 'single'} `}>
            <CreatableSelect
                id='react-multi-inputs-2'
                components={components}
                inputValue={inputValue}
                value={value}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue) => setValue(newValue)}
                onInputChange={(newValue) => setInputValue(newValue)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={placeholder ? placeholder : 'Enter Value'}
            />
            {
                (errorHandler && error) ? <p className={`error ${error && 'error-visible'}`} >This field is required</p> : null
            }
        </div >
    );
};



// radio button
export const RadioButton = ({ additionalClass, id, name, label, disable, inputHandler, value, selectedOption }) => {
    return (
        <div className={`input-container ${additionalClass ? additionalClass : ''}`}>
            <input
                type='radio'
                id={id}
                name={name}
                onChange={inputHandler}
                disabled={disable}
                value={value}
                checked={selectedOption === value}
            />
            <label htmlFor={id}>
                <LightParagraph size='xxs' >
                    {label}
                </LightParagraph>
            </label>
        </div>
    );
};

// react select 
export const ReactSelect = ({ additionalClass, id, option, errorId, name, error, errorMessage, label, required, value, inputHandler, disable, isSearchable }) => {

    return (
        <div className={`input-container react-select ${additionalClass ? additionalClass : ''} ${error ? 'error-color' : ''}`}>
            {
                label && <label htmlFor={id}>
                    <LightParagraph size='s' >
                        {label} {required && <span className="imp">*</span>}
                    </LightParagraph>
                </label>
            }
            <Select
                isSearchable={isSearchable ? isSearchable : false}
                options={option}
                onChange={inputHandler}
                disabled={disable ? true : false}
                value={value}
                css={{}}
                name={name ? name : 'select'}
            />
            <p id={errorId} className={`error ${error && 'error-visible'}`} htmlFor={id} >{errorMessage}</p>
        </div>

    )
}

// react select creatable
export const ReactSelectCreatable = ({ additionalClass, id, errorId, error, placeholder, errorMessage, label, required, value, options, onBlur, tempKeywordHandeler, onChangeHandeler, tempKeyword, onKeyHandler, disable }) => {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <div className={`input-container react-select  ${additionalClass} ${error ? 'error-color' : ''}`}>

            {
                label && <label htmlFor={id}>
                    {label} {required && <span className="imp">*</span>}
                </label>
            }
            <CreatableSelect
                components={components}
                inputValue={tempKeyword}
                isClearable
                onChange={onChangeHandeler}
                onInputChange={tempKeywordHandeler}
                onKeyDown={onKeyHandler}
                onBlur={onBlur}
                placeholder={placeholder ? placeholder : "Type something and press enter..."}
                value={value}
                options={options}
                css={{}}
                handleKeyPress={handleKeyPress}
                isDisabled={disable}
            />
            <p id={errorId} className={`error ${error && 'error-visible'}`} htmlFor={id}>
                {errorMessage}
            </p>
        </div>
    );
};

// checkbox 
export const Checkbox = ({ additionalClass, id, name, label, disable, checked, inputHandler, placeholder, topSpace }) => {

    const [selected, setSelected] = useState(checked)
    useEffect(() => setSelected(checked), [checked])
    const topspace = topSpace ? topSpace : false;

    return (
        <div className={`input-container checkbox-container ${additionalClass ? additionalClass : ''}  ${topspace ? 'top-space' : ''} `}>
            {topspace && <p className="para light s ">top space </p>}
            <label htmlFor={id}>
                <input type='checkbox' id={id} name={name} onChange={inputHandler} placeholder={placeholder} disabled={disable ? true : false} checked={selected ? selected : false} />
                <span className="checkbox-tick">    </span>
                {label}
            </label>
        </div>
    )
}


