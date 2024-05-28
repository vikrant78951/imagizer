import JSZip from 'jszip';


const domain = 'https://images.internal.reports.mn/'
// const domain = 'https://images-stage.internal.reports.mn/'



// Cookie helpper 
export const CookieHelper = {
    setCookie(key, value, expiresDay) {
        const d = new Date();
        // d.setTime(d.getTime() + (expiresDay * 24 * 60 * 60 * 1000));
        d.setTime(d.getTime() + (expiresDay * 1000));
        document.cookie = `${key}=${value};expires=${d.toUTCString() || null};path=/;`
    },
    getCookie(key) {
        let name = key + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return false;
    },
    removeCookies(key) {
        document.cookie = `${key}= ''; max-age=0`;

    }
}


// Localstorage helpper 
export const LocalStorage = {
    isSupported() {
        return typeof Storage !== 'undefined';
    },
    has(key) {
        return localStorage.hasOwnProperty(key);
    },
    get(key) {
        let item = localStorage.getItem(key);

        if (typeof item !== 'string') return item;

        if (item === 'undefined') return undefined;

        if (item === 'null') return null;

        if (item === true) return true;

        if (item === false) return false;

        // Check for numbers and floats
        if (/^'-?\d{1,}?\.?\d{1,}'$/.test(item)) return Number(item);

        // Check for numbers in scientific notation
        if (/^'-?\d{1}\.\d+e\+\d{2}'$/.test(item)) return Number(item);

        // Check for serialized objects and arrays
        if (item[0] === '{' || item[0] === '[') return JSON.parse(item);

        return item;
    },
    set(key, value) {
        if (typeof key !== 'string') {
            throw new TypeError(`localStorage: Key must be a string. (reading '${key}')`)
        }

        if (typeof value === 'object' || typeof value === 'array') {
            value = JSON.stringify(value);
        }

        localStorage.setItem(key, value);
    },
    remove(key) {
        localStorage.removeItem(key);
    },
}


// get keyword from array in different forms 
export const getKeyword = (inputArray) => inputArray.map(item => encodeURIComponent(item.value)).join('-new-');
export const getKeywordWithOutLineBreak = (inputArray) => inputArray.map(item => encodeURIComponent(item.value)).join('+');
export const getKeywordByForwordSlash = (inputArray) => inputArray.map(item => encodeURIComponent(item.value)).join("%0A");
export const getKeywordByComma = (inputArray) => inputArray.map(item => encodeURIComponent(item.value)).join(", ");


// authentication 
export const isAuthenticated = () => {
    const authCheck = CookieHelper.getCookie('JSESSIONID');
    return authCheck !== '' && authCheck !== null && authCheck !== false;
};


// authenticate page 
export const authenticatePage = () => {
    const authCookies = CookieHelper.getCookie('JSESSIONID');
    const authCheck = authCookies !== '' && authCookies !== null && authCookies !== false;
    if (!authCheck) {
        window.location.reload();
    }
}



// update filter 
export const getFilter = (domain, uploadImagesCheckbox) => {
    // console.log(domain, uploadImagesCheckbox)
    let filterData = 1;

    // if domain true 
    if (domain === 'titanium.com' || domain === 'Titanium' || domain === 'forbes.com' || domain === 'Forbes' || domain === 'ginsu.com' || domain === 'GINSU') {
        if (uploadImagesCheckbox) {
            filterData = 3
        } else {
            filterData = 2
        }
    } else {
        // else domain false 
        filterData = 1
    }

    return filterData
}

// get files from array 
export const getFiles = (arr) => {
    return new Promise((res, rej) => {
        let arrOfFiles = [];
        arr.forEach(files => arrOfFiles.push(files.file))
        res(arrOfFiles)
    })
}

// get current date time in format 2023-05-11 10:12:29.913
export const getCurrentDateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

}

// disable button 
export const disableButton = (btnid) => {
    let ButtonId = '#' + btnid
    let allButtons = document.querySelectorAll(ButtonId)
    allButtons.forEach(button => {
        button.disabled = true;
    })

}


// enable button  
export const enableButton = (btnid) => {
    let ButtonId = '#' + btnid
    let allButtons = document.querySelectorAll(ButtonId)
    allButtons.forEach(button => {
        button.disabled = false;
    })
}

// download Image 
export const downloadImage = async (url, filename, openToast, closeToast) => {

    console.log('download-' + url)
    if (openToast && closeToast) {
        openToast('loading', 'Image downloading')
    }
    await fetch(url, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.blob())
        .then(blob => {
            if (blob.size === 0 && blob.type === '') {
                if (openToast && closeToast) {
                    openToast('error', 'Image Failed to download')
                    closeToast(4000)
                }
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                if (openToast && closeToast) {
                    openToast('success', 'Image Downloaded')
                    closeToast(2000)
                }
            }
        });
}

// remove values from array based on index value
export const removeItemByIndex = (files, index) => {
    return files.filter((file) => {
        return Number(file.id) !== Number(index);
    });
};


// truncated Name for the file
export const fileNameShortner = (fileName, maxLength) => {
    let extension = fileName.slice(fileName.lastIndexOf('.'), fileName.length)
    let nameOfFile = fileName.slice(0, fileName.lastIndexOf('.'));
    let truncated = (nameOfFile.length > maxLength) ? nameOfFile.slice(0, maxLength).concat('..') : nameOfFile
    return truncated + extension;
}

// truncated text
export const textShortner = (fileName, maxLength) => {
    return (fileName.length > maxLength) ? fileName.slice(0, maxLength).concat('...') : fileName
}



// filter files 
export const filterFile = (uploadedFiles) => {
    const validFiles = uploadedFiles.filter((file) => file.validType === true);
    return validFiles;
};


// generate download link 
export const downloadLink = (fileName, uploadPath) => {
    return `https://images.internal.reports.mn/downloadServlet?fileName=${fileName}&uploadPath=${uploadPath}`
}


export const logoutHelper = () => {
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    LocalStorage.set('user', '')
    LocalStorage.set('team', '')
    LocalStorage.set('domain', '')
    LocalStorage.set('authentication', "false")

}


export const getArrayCount = (arr) => {
    let count = 0;
    if (Array.isArray(arr)) {
        arr.forEach(element => {

            if (Array.isArray(element)) {
                element.forEach(itme => {
                    count = count + 1
                })
            }
        })
    }
    return count;

}

// close all dropdown 
export const closeAllDropdown = () => {
    const allDropdown = document.querySelectorAll('.dropdown')
    allDropdown.forEach(dropdown => {
        dropdown.classList.remove('active')
    })

    const allTooltip = document.querySelectorAll('.tooltip-container')
    allTooltip.forEach(dropdown => {
        dropdown.classList.remove('active')
    })

}


export const checkNavigatorPermission = async () => {
    if (navigator.permissions) {
        await navigator.permissions.query({ name: 'clipboard-read' }).then(result => {
            if (result.state === 'granted' || result.state === 'prompt') {
                // You have permission to read the clipboard, or you can request it.
                // Proceed with clipboard operations here.
            } else {
                // Handle the case where clipboard access is denied.
                console.error('Clipboard access denied.');
            }
        });
    }

}


export const splitValueBySlashN = (pastedText) => {
    const uniqueValues = new Set();

    const result = pastedText
        .split(/\n|\t/) // Split by either newline or tab
        .map((inputValue) => inputValue.replace(/[\\"'\r]/g, '').trim()) // Remove backslashes, double quotes, carriage return characters, and trim spaces
        .filter((inputValue) => inputValue !== '') // Exclude empty values
        .filter((inputValue) => {
            if (!uniqueValues.has(inputValue)) {
                uniqueValues.add(inputValue);
                return true; // Keep the value if it's not a duplicate
            }
            return false; // Exclude the value if it's a duplicate
        });

    return result;
};

// export const formatDateTime = (inputDate) => {
//     console.log(inputDate)
//     const date = new Date(inputDate);

//     if (isNaN(date.getTime())) {
//         return "Invalid Date";
//     }

//     const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     const year = date.getFullYear().toString().slice(-2);
//     const month = monthsShort[date.getMonth()];
//     const day = date.getDate();
//     const hours = date.getHours();
//     const minutes = date.getMinutes();

//     const amOrPm = hours >= 12 ? "pm" : "am";
//     const formattedHours = hours % 12 || 12;

//     const formattedDateTime = `${month}-${day}-${year} ${formattedHours}:${String(minutes).padStart(2, '0')}${amOrPm}`;

//     return formattedDateTime;
// }

export const formatDateTime = (utcDateTimeString) => {
    const utcDateTime = new Date(utcDateTimeString);
    const indianUTCOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    const indianDateTime = new Date(utcDateTime.getTime() + indianUTCOffset);

    const options = { month: 'short', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' };
    let formattedDateTime = indianDateTime.toLocaleDateString('en-US', options).replace(',', '');

    const hours = indianDateTime.getHours();
    const minutes = indianDateTime.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    console.log(formattedDateTime)
    // formattedDateTime += ` ${formattedHours}:${formattedMinutes}${ampm}`;
    return formattedDateTime;
}



export const removeDataFromObject = (obj, row) => {
    if (obj && obj.hasOwnProperty(row)) {
        const { metaData, ...rest } = obj;
        return rest;
    }
    return obj;
};



export const createCSV = (data) => {
    return new Promise((res, rej) => {
        const headers = Object.keys(data[0]); // Assuming the first object in the array represents headers
        const csvContent = `${headers.map(header => `"${header}"`).join(",")}\n${data.map(row => headers.map(header => `"${row[header] || ''}"`).join(",")).join("\n")
            }`;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        res(blob);
    });
};


export const createZip = async (images, size) => {
    try {
        const zip = new JSZip();
        const imagePromises = images.map((image, index) => {
            let downloadApi = `${domain + 'downloadCropped'}?imageId=${image.imageId}&size=${size}&type=1`
            return fetch(downloadApi, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.blob())
                .then((blob) => zip.file(`image${index + 1}.jpg`, blob));
        })
        return Promise.all(imagePromises).then(() => {
            let csv = createCSV(images)
            zip.file('images.csv', csv)
            return zip
        });
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}

export const createZipById = async (data, alldata) => {
    try {
        const zip = new JSZip();
        const imagePromises = data.map((d, index) => {
            let downloadApi = `${domain + 'downloadCropped'}?imageId=${d.image_id}&size=250x150&type=1`
            return fetch(downloadApi, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.blob())
                .then((blob) => zip.file(`image${index + 1}.jpg`, blob));
        })
        return Promise.all(imagePromises).then(() => {
            let csv = createCSV(alldata)
            zip.file('images.csv', csv)
            return zip
        });
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}


export const createZip2 = async (images, size) => {
    console.log(images)
    try {
        const zip = new JSZip();
        const imagePromises = images.map((image, index) => {
            let downloadApi = `${domain + 'downloadCropped'}?imageId=${image.originalImageId}&size=${size}&type=1`
            return fetch(downloadApi, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.blob())
                .then((blob) => zip.file(`image${index + 1}.jpg`, blob));
        })
        return Promise.all(imagePromises).then(() => {
            let csv = createCSV(images)
            zip.file('images.csv', csv)
            return zip
        });
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}

export const createZipBy_imageId = async (images, size) => {

    try {
        const zip = new JSZip();
        const imagePromises = images.map(async (simage, index) => {
            console.log('image id ', simage.imageId)
            let downloadApi = `${domain + 'downloadCropped'}?imageId=${simage.imageId}&size=${size}&type=1`
            return fetch(downloadApi, {
                method: 'GET',
                credentials: 'include',
            }).then(response => response.blob())
                .then((blob) => zip.file(`image${index + 1}.jpg`, blob));
        })
        return Promise.all(imagePromises).then(() => {
            let csv = createCSV(images)
            zip.file('images.csv', csv)
            return zip
        });
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}


//update state object
export const updateStateObject = (field, value, setterMethod) => {
    setterMethod(previousState => {
        return { ...previousState, [field]: value }
    });
}




// short data based on keyword 
export const shortDataByKeyword = (datalist) => {

    return datalist.reduce((acc, obj) => {
        const keyword = obj.keyword;
        const keywordGroup = acc.find(group => group[0].keyword === keyword);

        if (keywordGroup) {
            keywordGroup.push(obj);
        } else {
            acc.push([obj]);
        }

        return acc;
    }, []);
}





// prevent form submition 
export const preventFormSubmit = (e) => {
    e.preventDefault();
}






// filter data by review flag 
export const sortByReviewFlag = (arr, order) => {
    return new Promise((res, rej) => {
        console.log(arr, order)
        let newArray = []
        if (order === '0') { //Good
            console.log('filtering Good....')
            arr.forEach(data => {
                let tempArr = data.filter(item => (item.reviewedGood && !item.isTaxonomy));
                if (tempArr.length > 0) {
                    newArray.push(tempArr)
                }
            })
        }

        if (order === 'Bad') {
            // console.log('ordering bad....')

            arr.forEach(data => {
                let tempArr = data.filter(item => item.reviewFlag === '10');
                if (tempArr.length > 0) {
                    newArray.push(tempArr)
                }
            })
        }

        if (order === '1') { //unReviewed
            // console.log('ordering UnReviewed....')

            arr.forEach(data => {
                let tempArr = data.filter(item => !item.reviewedGood && !item.isTaxonomy && item.reviewFlag !== '10');
                if (tempArr.length > 0) {
                    newArray.push(tempArr)
                }
            })

        }


        if (order === 'manual') { //Manual
            // console.log('ordering manual....')

            arr.forEach(data => {
                let tempArr = data.filter(item => item.imageTypeDisplay !== "PATTERN_IMAGE");
                if (tempArr.length > 0) {
                    newArray.push(tempArr)
                }
            })
        }

        if (order === 'pattern') { //pattern
            // console.log('ordering pattern....')

            arr.forEach(data => {
                let tempArr = data.filter(item => item.imageTypeDisplay === "PATTERN_IMAGE");
                if (tempArr.length > 0) {
                    newArray.push(tempArr)
                }
            })
        }

        if (order === '-1') { //all
            newArray = arr
        }


        if (order === 'user') { //user
            let user = LocalStorage.get('user')
            // console.log('ordering users ', user)

            arr.forEach(data => {
                let tempArr = data.filter(item => item.suggestedBy === user);
                if (tempArr.length > 0) {
                    newArray.push(tempArr)
                }
            })
        }

        res(newArray)
    })

}


// update image path 
export const getPathBySize = (path, size) => {
    if (path) {
        return path.replace(/\/\d+x\d+\//, `/${size}/`);
    }
    else {
        return ''
    }
}

//create option fro msearch value 
export const createOption = (label) => ({
    label,
    value: label,
});

export const createOptionArray = (arr) => {
    let keywordArray = [];
    arr.map((item) => {
        keywordArray.push({
            label: item,
            value: item
        })
    })
    return keywordArray;
};


// convert string size to  array list 
export const convertSizesToList = (sizesString) => {
    if (!sizesString) {
        return [];
    }
    const sizesArray = sizesString.split(',');
    const imageSizeList = sizesArray.map(size => {
        const [width, height] = size.split('x');
        return {
            label: `${width}x${height}`,
            value: size,
        };
    });
    return imageSizeList;
}

export const convertSizesToListOriginal = (sizesString) => {
    if (!sizesString) {
        return [];
    }
    const sizesArray = sizesString.split(',');
    const imageSizeList = sizesArray.map(size => {
        const [width, height] = size.split('x');
        return {
            label: `${width}x${height} (Og)`,
            value: size,
        };
    });
    return imageSizeList;
}



