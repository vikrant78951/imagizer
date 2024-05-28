
export const inputsField = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    message: '',
    keyword: '',
    requestTypes: '',
    requestSize: '',
    mappingType: '',
    mappingTerm: '',
    siteName: '',
    siteName_r: '',
    customerId: '',
    ssid: '',
    imageUrl: '',
    purpose: '',
    size: '',
    customSize: '',
    downloadSize: '',
    reviewedType: '',
    keywordArray: [],
    mappingTermArray: [],
    team: '',
    url: '',
    expiryDate: '',
    sourceUrl: '',
    tags: [],
    mappingFrom: '',
    width: '',
    height: '',
    priority: '',
    pattern: '',
}

export const errorField = {
    formIsValid: false,
    firstName: false,
    username: false,
    lastName: false,
    email: false,
    password: false,
    message: false,
    keyword: false,
    requestTypes: false,
    requestSize: false,
    mappingType: false,
    mappingTerm: false,
    ssid: false,
    imageUrl: false,
    siteName: false,
    siteName_r: false,
    customerId: false,
    purpose: false,
    size: false,
    customSize: false,
    downloadSize: false,
    reviewedType: false,
    keywordArray: false,
    mappingTermArray: false,
    team: false,
    url: false,
    expiryDate: false,
    sourceUrl: false,
    tags: false,
    mappingFrom: false,
    width: false,
    height: false,
    priority: false,
    pattern: false,

}

export const errorMessagefield = {
    firstName: '',
    username: '',
    lastName: '',
    email: '',
    password: '',
    message: '',
    keyword: '',
    requestTypes: '',
    requestSize: '',
    mappingType: '',
    mappingTerm: '',
    ssid: '',
    imageUrl: '',
    siteName: '',
    siteName_r: '',
    customerId: '',
    purpose: '',
    size: '',
    customSize: '',
    downloadSize: '',
    reviewedType: '',
    keywordArray: '',
    mappingTermArray: '',
    team: '',
    url: '',
    expiryDate: '',
    sourceUrl: '',
    tags: [],
    mappingFrom: '',
    width: '',
    height: '',
    priority: '',
    pattern: '',
}


export const updateData = (field, value, setterMethod) => {
    return new Promise((resolve, reject) => {
        // console.log('updating fields ', field, value)
        setterMethod(previousState => {
            return { ...previousState, [field]: value }
        });
        resolve()
    })

}


const handelCase = (type, field, value, setError, setErrorMessage, minChar = 2, costomError, testRagex) => {

    // If type is text 
    if (type === 'text') {

        // console.log('validating field firstName=', value);
        if (value === '' && minChar > 0) {
            updateData(field, true, setError);
            updateData(field, 'This field is required.', setErrorMessage);
        } else {

            // if we have regex test them 
            if (testRagex !== null && value !== '') {
                if (!testRagex.test(value)) {
                    updateData(field, true, setError);
                    updateData(field, costomError, setErrorMessage);
                    return
                }
            }

            // if we have atleast 2 inputs 
            if (value.length < minChar) {
                updateData(field, true, setError);
                updateData(field, 'Please enter at least ' + minChar + ' characters.', setErrorMessage);
                return
            }

            // if we dont have any error 
            updateData(field, false, setError);
            updateData(field, '', setErrorMessage);

        }

    }

    // If type is number 
    if (type === 'number') {

        // console.log('validating field firstName=', value);
        if (value <= 0 && minChar > 0) {
            updateData(field, true, setError);
            updateData(field, 'This field is required.', setErrorMessage);
            return
        } else {

            // if we have regex test them 
            if (testRagex !== null && value !== '') {
                if (!testRagex.test(value)) {
                    updateData(field, true, setError);
                    updateData(field, costomError, setErrorMessage);
                    return
                }
            }

            // if we have atleast 2 inputs 
            if (value.length < minChar) {
                updateData(field, true, setError);
                updateData(field, 'Please enter at least ' + minChar + ' characters.', setErrorMessage);
                return
            }

            // if we dont have any error 
            updateData(field, false, setError);
            updateData(field, '', setErrorMessage);

        }

    }

    // If type is Selector
    if (type === 'select') {
        // console.log(value)
        if (value === '' || value === null) {
            updateData(field, true, setError);
            updateData(field, 'This field is required.', setErrorMessage);
        } else {

            // if we have regex test them 
            if (testRagex !== null) {
                // console.log(testRagex.test(value))
                if (testRagex.test(value)) {
                    updateData(field, true, setError);
                    updateData(field, '', setErrorMessage);
                    return;
                } else {
                    updateData(field, false, setError);
                    updateData(field, costomError, setErrorMessage);
                    return;
                }
            }

            // if we dont have any error 
            updateData(field, false, setError);
            updateData(field, '', setErrorMessage);
        }
    }

    // if type is date 
    if (type === 'date') {
        if (value === '' || value === null) {
            updateData(field, true, setError);
            updateData(field, 'This field is required.', setErrorMessage);
        } else {
            // if we dont have any error 
            updateData(field, false, setError);
            updateData(field, '', setErrorMessage);
        }

    }
}

export const validationField = (name, value, setError, setErrorMessage) => {
    // console.log('validating field', name, value)
    switch (name) {
        case 'username': handelCase('text', 'username', value, setError, setErrorMessage, 2, 'plese enter a valid username', ragex.username)
            break;
        case 'password': handelCase('text', 'password', value, setError, setErrorMessage, 2, 'plese enter a valid password', ragex.password)
            break;
        case 'ssid': handelCase('text', 'ssid', value, setError, setErrorMessage, 2, 'plese enter a valid Id', ragex.ssid)
            break;
        case 'customerId': handelCase('text', 'customerId', value, setError, setErrorMessage, 0, 'plese enter a valid Input', ragex.number)
            break;
        case 'mappingTerm': handelCase('text', 'mappingTerm', value, setError, setErrorMessage, 2, 'plese enter a valid Input', ragex.mappingTerm)
            break;
        case 'keyword': handelCase('text', 'keyword', value, setError, setErrorMessage, 1, 'plese enter a valid Input', null)
            break;
        case 'keywordArray': handelCase('text', 'keywordArray', value, setError, setErrorMessage, 1, 'plese enter a valid Input', null)
            break;
        case 'mappingTermArray': handelCase('text', 'mappingTermArray', value, setError, setErrorMessage, 1, 'plese enter a valid Input', null)
            break;
        case 'email': handelCase('text', 'email', value, setError, setErrorMessage, 2, 'plese enter a valid Email', ragex.email)
            break;
        case 'message': handelCase('text', 'message', value, setError, setErrorMessage, 2, 'plese enter a valid Input', null)
            break;
        case 'siteName': handelCase('text', 'siteName', value, setError, setErrorMessage, 0, 'plese enter a valid Input', null)
            break;
        case 'siteName_r': handelCase('text', 'siteName_r', value, setError, setErrorMessage, 0, 'plese enter a valid Input', null)
            break;
        case 'requestTypes': handelCase('select', 'requestTypes', value, setError, setErrorMessage, 2, 'plese enter a valid Input', null)
            break;
        case 'reviewedType': handelCase('select', 'reviewedType', value, setError, setErrorMessage, 2, 'plese enter a valid Input', null)
            break;
        case 'team': handelCase('select', 'team', value, setError, setErrorMessage, 2, 'plese enter a valid Input', null)
            break;
        case 'size': handelCase('select', 'size', value, setError, setErrorMessage, 2, 'plese enter a valid Size', null)
            break;
        case 'downloadSize': handelCase('select', 'downloadSize', value, setError, setErrorMessage, 2, 'plese enter a valid Input', null)
            break;
        case 'customSize': handelCase('select', 'customSize', value, setError, setErrorMessage, 3, 'plese enter a valid Input', ragex.customSize)
            break;
        case 'mappingType': handelCase('select', 'mappingType', value, setError, setErrorMessage, 2, 'plese enter a valid Input', null)
            break;
        case 'url': handelCase('select', 'url', value, setError, setErrorMessage, 2, 'plese enter a valid Url', null)
            break;
        case 'imageUrl': handelCase('text', 'imageUrl', value, setError, setErrorMessage, 2, 'plese enter a valid Url', ragex.url)
            break;
        case 'expiryDate': handelCase('date', 'expiryDate', value, setError, setErrorMessage, 0, 'plese enter a valid Input', null)
            break;
        case 'sourceUrl': handelCase('text', 'sourceUrl', value, setError, setErrorMessage, 8, 'plese enter a valid Url', ragex.url)
            break;
        case 'tags': handelCase('text', 'tags', value, setError, setErrorMessage, 1, 'plese enter a valid Url', null)
            break;
        case 'width': handelCase('number', 'width', value, setError, setErrorMessage, 1, 'plese enter a valid size', ragex.number)
            break;
        case 'height': handelCase('number', 'height', value, setError, setErrorMessage, 1, 'plese enter a valid size', ragex.number)
            break;
        case 'purpose': handelCase('text', 'purpose', value, setError, setErrorMessage, 0, 'plese enter a valid Purpose', null)
            break;
        case 'priority': handelCase('number', 'priority', value, setError, setErrorMessage, 1, 'plese enter a valid input', ragex.number)
            break;
        case 'pattern': handelCase('text', 'pattern', value, setError, setErrorMessage, 1, 'plese enter a valid input', null)
            break;
        default: console.log('unknown field for validate')
    }
}


export const ragex = {
    name: /^[A-Za-z]+$/,
    mappingTerm: /^[A-Za-z0-9_ ]+$/,
    ssid: /^[0-9 ,]+$/,
    username: /^[a-zA-Z0-9@_.$]+$/,
    password: /^[a-zA-Z0-9@_.$]+$/,
    number: /^[0-9]+$/,
    customSize: /^[0-9]+x[0-9]+$/,
    email: /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/,
    // url: /^http:\/\/.*?\.jpg$/,
    url: /^https?:\/\/.*$/,



}


export const singleInputHandleKeyDown = async (event, fieldName, setValue, field, setInputsField, setError, setErrorMessage) => {

    console.log('singleInputHandleKeyDown  call ')

    if (event.key === 'Enter' || event.key === 'Tab') {
        const inputValue = event.target.value.trim();

        if (inputValue) {
            const newOption = {
                value: inputValue,
                label: inputValue,
                key: `${fieldName}-inputData-${field[fieldName]}` // Generate unique key
            };
            updateData(fieldName, newOption, setInputsField);
            console.log(field)
            console.log(newOption)
            validationField('customSize', inputValue, setError, setErrorMessage)

            setValue('');
            // event.preventDefault()
        }
    }

    if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
        console.log('calling paste method')
        try {
            const pastedText = await navigator.clipboard.readText();

            const inputList = pastedText
                .split('\n')
                .map((inputValue) => inputValue.replace(/[\\"'\r]/g, '')) // Remove backslashes, double quotes, and carriage return characters
                .filter((inputValue) => inputValue.trim() !== ''); // Exclude empty values

            console.log('inputlist', inputList)

            const newOption = {
                value: inputList[inputList.length - 1],
                label: inputList[inputList.length - 1],
                key: `${inputList[inputList.length - 1]}-inputData-${inputList.length}}` // Generate unique key
            };
            console.log(field)
            console.log(newOption)

            updateData(fieldName, {}, setInputsField);
            updateData(fieldName, newOption, setInputsField);

            validationField('customSize', inputList[inputList.length - 1], setError, setErrorMessage)

            setValue('');

        } catch (error) {
            console.log('Failed to read clipboard data:', error);
        }
    }




};

export const singleInputHandleBlur = (event, fieldName, setValue, field, setInputsField, setError, setErrorMessage) => {
    // console.log('singleInputHandleBlur call')

    const inputValue = event.target.value.trim();
    if (inputValue) {
        const newOption = {
            value: inputValue,
            label: inputValue,
            key: `${fieldName}-inputData-${field[fieldName]}` // Generate unique key
        };
        console.log(field)
        console.log(newOption)

        updateData(fieldName, newOption, setInputsField);
        validationField('customSize', inputValue, setError, setErrorMessage)

        setValue('');
    }


};



export const handleFormSubmit = (e) => {
    e.preventDefault();
};