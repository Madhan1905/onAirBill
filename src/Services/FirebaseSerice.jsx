import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";
import AuthenticationService from './AuthenticationService';

const getUserDocument = () => {
    return new Promise(async (resolve, reject) => {
        var userId = AuthenticationService.getUserId();
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users');
        resolve(collectionRef.doc(userId))
    })
}

export const registerUser = (fields) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users').doc("+91" + fields.phone).collection('Profile');
        var date = new Date();
        collectionRef.doc("Profile").set(fields)
        .then(res => {
            resolve("Registered");
        })
        .catch(error => {
            console.log(error)
            reject("Error")
        })
    });
}

export const getUserData = (phone) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users').doc("+91" + phone).collection("Profile");
        var date = new Date();
        collectionRef.doc("Profile").get()
        .then(doc => {
            resolve(doc.data())
        })
        .catch(error => {
            console.log(error)
            reject(error)
        })
    });
}

export const register = (userName, password, name) => {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(userName, password)
            .then(result => {
                var user = result.user;
                user.updateProfile({
                    displayName: name,
                }).then(() => {
                    resolve("Done")
                }).catch(error => console.log(error))
            }).catch(error => {
                reject(error)
            })
    });
}

export const createStaff = (userId,userName,password) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Staffs');
        var date = new Date();
        collectionRef.doc(userId).set({
            LoggedIn: true,
            LoginTime: date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " at "
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
            userName: userName,
            password: password,
            client: AuthenticationService.getUserId()
        })
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            console.log(error)
            reject(error)
        })
    });
}

export const deleteStaffs = (staffs) => {
    const dataBase = firebase.firestore();
    let collectionRef = dataBase.collection('Staffs');
    return new Promise(async(resolve, reject) => {
        await Promise.all(
            staffs.map(async item => {
                collectionRef.doc(item.id).delete()
                .then(res => {
                    return res
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        ).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    });
}

export const updateUserStatus = (userId,status) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Staffs');

        collectionRef.doc(userId).update({
            disabled: !status
        })
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            console.log(error)
            reject(error)
        })
    });
}

export const fetchStaffs = () => {
    return new Promise(async (resolve, reject) => {
        const dataBase = firebase.firestore();
        let addressRef = dataBase.collection('Staffs');

        let addressArray = [];
        addressRef.where('client', '==', AuthenticationService.getUserId()).get()
            .then((address) => {
                if (address.size > 0) {
                    address.docs.map(doc =>
                        addressArray.push({id: doc.id,...doc.data()})
                    )
                    resolve(addressArray);
                } else {
                    resolve(addressArray)
                }

            })
            .catch(error => {
                reject(error)
            })
    })
}

export const setPaidUsers = (phoneNumber,registrationType) => {
    return new Promise(async (resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('UserManagement');
        if(registrationType === "Trial"){
            registrationType = {type: "Trial", date: Date.now()}
        }

        collectionRef.doc("PaidUsers").update({[phoneNumber]: registrationType})
        .then(() => resolve("Registered"))
        .catch(err => {
            console.log('Error getting document', err);
            reject(false);
        });
    })
}


export const checkPaidUsers = (phoneNumber, isCheckingFromLogin) => {
    return new Promise(async (resolve, reject) => {
        const dataBase = firebase.firestore();
        let db = dataBase.collection('UserManagement').doc("PaidUsers");
        let getDoc = db.get()
        .then(doc => {
        if (!doc.exists) {
            console.log("Paid user Doc Not Found");
            resolve(false);
        } else {
            if(doc.get(phoneNumber) != null) {
                var data = doc.data();
                //console.log('Document data:', data);
                if(isCheckingFromLogin){
                    if(data[phoneNumber] == "Registered"){
                        //console.log("Active Paid User");
                        resolve("Valid User");
                    }
                    else if(data[phoneNumber] == "Expired"){
                        //console.log("Your Subcription has expired");
                        resolve("Sub Expired");
                    }else if(data[phoneNumber].type){
                        
                        const date1 = new Date(data[phoneNumber].date);
                        const date2 = new Date();
                        const diffTime = Math.abs(date2 - date1);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        
                        if(data[phoneNumber].type === "Trial"){
                            if(diffDays > 7){
                                resolve("Sub Expired");
                            } else {
                                resolve("Paid")
                            }   
                        } else if(data[phoneNumber].type === "Paid"){
                            if(diffDays > 365){
                                resolve("Sub Expired");
                            } else {
                                resolve("Paid")
                            }
                        }
                    }
                }
                else{
                    if(data[phoneNumber] == "Registered"){
                        resolve("Already Registered");
                    }
                    else if(data[phoneNumber] == "Expired"){
                        resolve("Already Registered");
                    }
                }
                
            } else {
                //console.log('Phone Number does not exist!');
                resolve("Invalid User");
            }
        }
        })
        .catch(err => {
            console.log('Error getting document', err);
            reject(false);
        });
    })
}

export const createUser = (userName) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users');
        var date = new Date();
        collectionRef.doc(userName).set({
            LoggedIn: true,
            LoginTime: date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " at "
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        })
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            console.log(error)
            reject(error)
        })
    });
}

const createKeyword = (name) => {
    let subName = '';
    var array = [];
    name.split('').map(letter => { 
        subName += letter; 
        array.push(subName)
    })
    return array;
}

export const SetCustomers = (fields) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var keyWordArray = [];

        var nameSpaces = fields.customerName.split(' ');
        nameSpaces.push(fields.customerName);

        nameSpaces.map(name => {
            keyWordArray = keyWordArray.concat(createKeyword(name.toUpperCase()));
        })

        let data = {nameArray: keyWordArray,...fields}

        UserDocument.collection('Customers').add(data)
        .then(doc => {
            resolve(doc.id)
        })
    })
}

export const UpdateCustomers = (fields,docId) => {
    console.log("Updating",docId)
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var keyWordArray = [];

        var nameSpaces = fields.customerName.split(' ');
        nameSpaces.push(fields.customerName);

        nameSpaces.map(name => {
            keyWordArray = keyWordArray.concat(createKeyword(name.toUpperCase()));
        })

        let data = {nameArray: keyWordArray,...fields}

        UserDocument.collection('Customers').doc(docId).update(data)
        .then(doc => {
            resolve("updated")
        })
    })
}

export const deleteCustomers = (staffs) => {
    return new Promise(async(resolve, reject) => {
        let UserDocument = await getUserDocument();
        let collectionRef = UserDocument.collection('Customers');
        await Promise.all(
            staffs.map(async item => {
                console.log("Deleting id",item.id)
                collectionRef.doc(item.id).delete()
                .then(res => {
                    return res
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        ).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    });
}

export const fetchCustomers = () => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();

        let addressRef = UserDocument.collection('Customers');
        let addressArray = [];
        addressRef.get()
            .then((address) => {
                if (address.size > 0) {
                    address.docs.map(doc =>
                        addressArray.push({id: doc.id,...doc.data()})
                    )
                    resolve(addressArray);
                } else {
                    resolve(addressArray)
                }

            })
            .catch(error => {
                reject(error)
            })
    })
}

export const SetTransport = (fields) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var keyWordArray = [];

        var nameSpaces = fields.transportName.split(' ');
        nameSpaces.push(fields.transportName);

        nameSpaces.map(name => {
            keyWordArray = keyWordArray.concat(createKeyword(name.toUpperCase()));
        })

        let data = {nameArray: keyWordArray,...fields}

        UserDocument.collection('Transport').add(data)
        .then(doc => {
            resolve(doc.id)
        })
    })
}

export const UpdateTransport = (fields,id) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var keyWordArray = [];

        var nameSpaces = fields.transportName.split(' ');
        nameSpaces.push(fields.transportName);

        nameSpaces.map(name => {
            keyWordArray = keyWordArray.concat(createKeyword(name.toUpperCase()));
        })

        let data = {nameArray: keyWordArray,...fields}

        UserDocument.collection('Transport').doc(id).update(data)
        .then(doc => {
            resolve("updated")
        })
    })
}

export const deleteTransports = (staffs) => {
    return new Promise(async(resolve, reject) => {
        let UserDocument = await getUserDocument();
        let collectionRef = UserDocument.collection('Transport');
        await Promise.all(
            staffs.map(async item => {
                console.log("Deleting id",item.id)
                collectionRef.doc(item.id).delete()
                .then(res => {
                    return res
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        ).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    });
}

export const fetchTransports = () => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();

        let addressRef = UserDocument.collection('Transport');
        let addressArray = [];
        addressRef.get()
            .then((address) => {
                if (address.size > 0) {
                    address.docs.map(doc =>
                        addressArray.push({id: doc.id,...doc.data()})
                    )
                    resolve(addressArray);
                } else {
                    resolve(addressArray)
                }

            })
            .catch(error => {
                reject(error)
            })
    })
}

export const SetProduct = (fields) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var keyWordArray = [];
        var date = new Date();

        var nameSpaces = fields.name.split(' ');
        if(nameSpaces.length > 1){
            nameSpaces.push(fields.name);
        }

        nameSpaces.map(name => {
            keyWordArray = keyWordArray.concat(createKeyword(name.toUpperCase()));
        })

        let data = {
            lastUpdated: date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear(),
            nameArray: keyWordArray,
            ...fields
        }

        UserDocument.collection('Products').add(data)
        .then(doc => {
            resolve(doc.id)
        })
    })
}

export const UpdateProduct = (fields,id) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var keyWordArray = [];
        var date = new Date();

        var nameSpaces = fields.name.split(' ');
        nameSpaces.push(fields.name);

        nameSpaces.map(name => {
            keyWordArray = keyWordArray.concat(createKeyword(name.toUpperCase()));
        })

        let data = {
            lastUpdated: date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear(),
            nameArray: keyWordArray,
            ...fields
        }

        UserDocument.collection('Products').doc(id).update(data)
        .then(doc => {
            resolve("updated")
        })
    })
}

export const UpdateProductStock = (qty,id) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        let data = {
            lastUpdated: date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear(),
            stock: qty
        }

        UserDocument.collection('Products').doc(id).update(data)
        .then(doc => {
            resolve("updated")
        }).catch((error) => reject(error))
    })
}

export const MultipleStockUpdate = (products) => {
    return new Promise(async(resolve, reject) => {
        let UserDocument = await getUserDocument();
        let collectionRef = UserDocument.collection('Products');
        await Promise.all(
            products.map(async item => {
                UpdateProductStock(item.stock,item.id)
                .then(res => {
                    return res
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        ).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    });
}

export const deleteProducts = (staffs) => {
    return new Promise(async(resolve, reject) => {
        let UserDocument = await getUserDocument();
        let collectionRef = UserDocument.collection('Products');
        await Promise.all(
            staffs.map(async item => {
                console.log("Deleting id",item.id)
                collectionRef.doc(item.id).delete()
                .then(res => {
                    return res
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        ).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    });
}

export const fetchSearchResult = (keyword) => {

    return new Promise(async(resolve, reject) => {
        let products = [];
        let UserDocument = await getUserDocument();
        let collectionRef = UserDocument.collection('Products');
        collectionRef.where('nameArray', 'array-contains', keyword.toUpperCase()).orderBy("name").get()
            .then((productDetails) => {
                productDetails.docs.map(product => {
                    products.push({id:product.id,...product.data()})
                })
                resolve(products)
            })
            .catch(error => {
                console.log(error)
                reject(error)
            })
    })
}

export const fetchProducts = () => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();

        let addressRef = UserDocument.collection('Products');
        let addressArray = [];
        addressRef.get()
            .then((address) => {
                if (address.size > 0) {
                    address.docs.map(doc =>
                        addressArray.push({id: doc.id,...doc.data()})
                    )
                    resolve(addressArray);
                } else {
                    resolve(addressArray)
                }

            })
            .catch(error => {
                reject(error)
            })
    })
}

function getCurrentFinancialYear() {
    var fiscalyear = "";
    var today = new Date();
    if ((today.getMonth() + 1) <= 3) {
      fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
    } else {
      fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
    }
    return fiscalyear
  }

export const SetSalesInvoice = (fields) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        UserDocument.collection('SalesInvoiceMeta').doc(getCurrentFinancialYear()).collection("Invoices").add(fields)
        .then(doc => {
            resolve(doc.id)
        })
    })
}

export const UpdateSalesInvoice = (fields,id) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        UserDocument.collection('SalesInvoiceMeta').doc(getCurrentFinancialYear()).collection("Invoices").doc(id).update(fields)
        .then(doc => {
            resolve("Updated")
        })
    })
}

export const DeleteSalesInvoice = (staffs) => {
    return new Promise(async(resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        await Promise.all(
            staffs.map(async item => {
                console.log("Deleting id",item.id)
                UserDocument.collection('SalesInvoiceMeta').doc(getCurrentFinancialYear()).collection("Invoices").doc(item.id).delete()
                .then(res => {
                    return res
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        ).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    });
}

export const fetchSalesInvoice = () => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        let addressRef = UserDocument.collection('SalesInvoiceMeta').doc(getCurrentFinancialYear()).collection("Invoices");
        let addressArray = [];
        addressRef.get()
            .then((address) => {
                if (address.size > 0) {
                    address.docs.map(doc =>
                        addressArray.push({id: doc.id,...doc.data()})
                    )
                    resolve(addressArray);
                } else {
                    resolve(addressArray)
                }

            })
            .catch(error => {
                reject(error)
            })
    })
}

export const SetPurchaseInvoice = (fields) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        UserDocument.collection('PurchaseInvoiceMeta').doc(getCurrentFinancialYear()).collection("Invoices").add(fields)
        .then(doc => {
            resolve(doc.id)
        })
    })
}

export const UpdatePurchaseInvoice = (fields,id) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        UserDocument.collection('PurchaseInvoiceMeta').doc(getCurrentFinancialYear()).collection("Invoices").doc(id).update(fields)
        .then(doc => {
            resolve("Updated")
        })
    })
}

export const DeletePurchaseInvoice = (staffs) => {
    return new Promise(async(resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        await Promise.all(
            staffs.map(async item => {
                console.log("Deleting id",item.id)
                UserDocument.collection('PurchaseInvoiceMeta').doc(getCurrentFinancialYear()).collection("Invoices").doc(item.id).delete()
                .then(res => {
                    return res
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        ).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    });
}

export const fetchPurchaseInvoice = () => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        let addressRef = UserDocument.collection('PurchaseInvoiceMeta').doc(getCurrentFinancialYear()).collection("Invoices");
        let addressArray = [];
        addressRef.get()
            .then((address) => {
                if (address.size > 0) {
                    address.docs.map(doc =>
                        addressArray.push({id: doc.id,...doc.data()})
                    )
                    resolve(addressArray);
                } else {
                    resolve(addressArray)
                }

            })
            .catch(error => {
                reject(error)
            })
    })
}

export const SetPayment = (fields,type) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        UserDocument.collection(type).add(fields)
        .then(doc => {
            resolve(doc.id)
        })
    })
}

export const UpdatePayment = (fields,id,type) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        UserDocument.collection(type).doc(id).update(fields)
        .then(doc => {
            resolve("Updated")
        })
    })
}

export const DeletePayment = (staffs,type) => {
    return new Promise(async(resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        await Promise.all(
            staffs.map(async item => {
                console.log("Deleting id",item.id)
                UserDocument.collection(type).doc(item.id).delete()
                .then(res => {
                    return res
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
            })
        ).then(result => {
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    });
}

export const fetchPayment = (type) => {
    return new Promise(async (resolve, reject) => {
        let UserDocument = await getUserDocument();
        var date = new Date();

        let addressRef = UserDocument.collection(type);
        let addressArray = [];
        addressRef.get()
            .then((address) => {
                if (address.size > 0) {
                    address.docs.map(doc =>
                        addressArray.push({id: doc.id,...doc.data()})
                    )
                    resolve(addressArray);
                } else {
                    resolve(addressArray)
                }

            })
            .catch(error => {
                reject(error)
            })
    })
}