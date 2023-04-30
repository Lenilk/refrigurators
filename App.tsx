import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Pressable,
  TextInput,
  FlatList,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
let App = () => {
  let [openAdd, setOpenAdd] = useState(false);
  let [selectIndex, setSelectIndex] = useState(0);
  let indexList = ['ในตู้เย็น', 'รายการสั่งซื้อ'];
  let index = indexList[selectIndex];
  let [name, setName] = useState('');
  let [amount, setAmount] = useState('');
  let [comment, setComment] = useState('');
  let canSave = name != '' && amount != '';
  let [canNotSave, setCanNotSave] = useState(false);
  let [errorText, setErrorText] = useState('');
  let [update, setUpdate] = useState(0);
  let [rfItem, setRfItem] = useState(
    Array<{name: String; Amount: String; _id: React.Key}>,
  );
  let [oldRfItem, setOldRfItem] = useState(
    Array<{name: String; Amount: String; _id: React.Key}>,
  );
  let [wantItem, setWantItem] = useState(
    Array<{name: String; Amount: String; _id: React.Key; Comment: String}>,
  );
  let [oldWantItem, setOldWantItem] = useState(
    Array<{name: String; Amount: String; _id: React.Key; Comment: String}>,
  );

  let [openDelete, setOpenDelete] = useState(false);
  let [openUpdate, setOpenUpdate] = useState(false);
  let [deleteWantItem, setDeleteWantItem] = useState<{
    name: String;
    Amount: String;
    _id: React.Key;
    Comment: String;
  }>({name: '', Amount: '', _id: '', Comment: ''});
  let [updateWantItem, setUpdateWantItem] = useState<{
    name: String;
    Amount: String;
    _id: React.Key;
    Comment: String;
  }>({name: '', Amount: '', _id: '', Comment: ''});
  let [loading, setLoading] = useState(true);
  let [deleteRfItem, setDeleteRfItem] = useState<{
    name: String;
    Amount: String;
    _id: React.Key;
  }>({name: '', Amount: '', _id: ''});
  let [updateRfItem, setUpdateRfItem] = useState<{
    name: String;
    Amount: String;
    _id: React.Key;
  }>({name: '', Amount: '', _id: ''});
  let [isConnect, setIsConnect] = useState(false);
  useEffect(() => {
    checkNet();
    if (isConnect) {
      getRf();
      getWant();
      storeData(rfItem, indexList[0]);
      storeData(wantItem, indexList[1]);
    } else {
      getData();
    }

    setTimeout(() => {
      setUpdate(update + 1);
    }, 5000);
    console.log(update);
  }, [update]);
  const storeData = async (value: any, type: String) => {
    try {
      if (
        JSON.stringify(value) !=
        (type == indexList[0]
          ? JSON.stringify(oldRfItem)
          : JSON.stringify(oldWantItem))
      ) {
        if (type == indexList[0]) {
          const jsonValue = JSON.stringify(value);
          setOldRfItem(value);
          await AsyncStorage.setItem('rfData', jsonValue);
        } else {
          const jsonValue = JSON.stringify(value);
          setOldWantItem(value);
          await AsyncStorage.setItem('wantData', jsonValue);
        }
        console.log('finish saving');
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async () => {
    try {
      const rfValue = await AsyncStorage.getItem('rfData');
      const wantValue = await AsyncStorage.getItem('wantData');
      let rfItems = rfValue != null ? JSON.parse(rfValue) : null;
      let wantItems = wantValue != null ? JSON.parse(wantValue) : null;
      if (wantItems != null) {
        setOldWantItem(wantItems);
        setWantItem(wantItems);
      }
      if (rfItems != null) {
        setOldRfItem(rfItems);
        setRfItem(rfItems);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const checkNet = () =>
    NetInfo.addEventListener(state => {
      setIsConnect(state.isConnected || false);
      console.log(state.isConnected);
    });

  const Delete = async (id: React.Key) => {
    if (index == indexList[1]) {
      await axios
        .delete(
          `https://refrigurator-oexhc495r-lenilk.vercel.app/deleteWant/${id}`,
        )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          setErrorText(error);
          console.log(error);
        });
      getWant();
    } else {
      await axios
        .delete(
          `https://refrigurator-oexhc495r-lenilk.vercel.app/deleteRf/${id}`,
        )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          setErrorText(error);
          console.log(error);
        });
      getRf();
    }
  };
  const Update = async (id: React.Key) => {
    // ! เช็คให้สามาถอัปเดตโดยผ่านอันใดอันหนึ่งเพื่ออัพเดต กำหนดตัวแปรเพิ่มสร้างทางเลือกในการอัปเดต ระหว่างสิ่งที่พิมพ์กับสิ่งที่มีอยู่แล้ว
    if (name != '' || comment != '' || amount != '') {
      let Name =
        name != ''
          ? name
          : index == indexList[1]
          ? updateWantItem['name']
          : updateRfItem['name'];
      let Amount =
        amount != ''
          ? amount
          : index == indexList[1]
          ? updateWantItem['Amount']
          : updateRfItem['Amount'];
      let Comment = comment != '' ? comment : updateWantItem['Comment'];
      if (index == indexList[1]) {
        await axios
          .patch(
            `https://refrigurator-oexhc495r-lenilk.vercel.app/updateWant/${id}`,
            {
              name: Name,
              Amount: Amount,
              Comment: Comment,
            },
          )
          // .then(function (response) {
          //   console.log(response);
          // })
          .catch(function (error) {
            setErrorText(error);
            console.log(error);
          });
        getWant();
      } else {
        await axios
          .patch(
            `https://refrigurator-oexhc495r-lenilk.vercel.app/updateRf/${id}`,
            {
              name: Name,
              Amount: Amount,
            },
          )
          // .then(function (response) {
          //   console.log(response);
          // })
          .catch(function (error) {
            setErrorText(error);
            console.log(error);
          });
        getRf();
      }
    }
  };
  const getWant = async () => {
    let responseWant: any = await axios
      .get('https://refrigurator-oexhc495r-lenilk.vercel.app/getWant')
      // .then(function (response) {
      //   console.log(response.data);
      // })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    const data: {
      name: String;
      Amount: String;
      _id: React.Key;
      Comment: String;
    }[] = responseWant.data;
    if (JSON.stringify(data) != JSON.stringify(wantItem)) {
      setWantItem(data);
    }

    setLoading(false);
  };
  const getRf = async () => {
    let responseRf: any = await axios
      .get('https://refrigurator-oexhc495r-lenilk.vercel.app/getRf')
      // .then(function (response) {
      //   console.log(response.data);
      // })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    const data: Array<{name: String; Amount: String; _id: React.Key}> =
      responseRf.data;
    if (JSON.stringify(data) != JSON.stringify(rfItem)) {
      setRfItem(data);
    }

    setLoading(false);
  };
  const add = async () => {
    if (canSave) {
      if (index == indexList[1]) {
        await axios
          .post('https://refrigurator-oexhc495r-lenilk.vercel.app/postWant', {
            name: name,
            Amount: amount,
            Comment: comment,
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            setErrorText(error);
            console.log(error);
          });
      } else {
        await axios
          .post('https://refrigurator-oexhc495r-lenilk.vercel.app/postRf', {
            name: name,
            Amount: amount,
          })
          .then(response => {
            console.log(response);
          })
          .catch(function (error) {
            setErrorText(error);
            console.log(error);
          });
      }
      setCanNotSave(false);
    }
  };
  function onClose() {
    if (index == indexList[1]) {
      setAmount('');
      setName('');
      setComment('');
    } else {
      setAmount('');
      setName('');
    }
    setCanNotSave(false);
  }
  function checkBeforeAdd() {
    if (!canSave) {
      setCanNotSave(true);
    }
  }
  return (
    <View style={{height: '100%', width: '100%'}}>
      {/* 

      Title bar 

      */}
      <View
        style={{
          flex: 0.6,
          width: '100%',
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(229, 115, 115)',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
            {index}
          </Text>
        </View>
        {/* 
         Main center view
        
        
        */}
      </View>

      <View
        style={{
          flex: 8.6,
          width: '100%',
        }}>
        {loading ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 40, color: 'rgb(56, 167, 241)'}}>
              Loading...
            </Text>
          </View>
        ) : (
          <>
            {/* 
      First Page
      */}
            <View
              style={
                index == indexList[0]
                  ? styles.MainVisible
                  : styles.MainUnvisible
              }>
              <FlatList
                numColumns={2}
                contentContainerStyle={{
                  width: '100%',
                  height: '100%',
                }}
                data={rfItem}
                renderItem={({item}) => (
                  <Pressable
                    onPress={() => {
                      if (isConnect) {
                        setUpdateRfItem(item);
                        setOpenUpdate(true);
                      }
                    }}
                    onLongPress={() => {
                      if (isConnect) {
                        setDeleteRfItem(item);
                        setOpenDelete(true);
                      }
                    }}
                    style={{
                      width: '45%',
                      height: 100,
                      backgroundColor: 'rgb(56, 167, 241)',
                      margin: '2.5%',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                      borderRadius: 10,
                      padding: 10,
                    }}>
                    <Text style={styles.text}>{item['name']}</Text>
                    <Text style={styles.text}>จำนวน {item['Amount']}</Text>
                  </Pressable>
                )}
              />
            </View>
            {/* 
      Second Page
      */}
            <View
              style={
                index == indexList[1]
                  ? styles.MainVisible
                  : styles.MainUnvisible
              }>
              <FlatList
                data={wantItem}
                contentContainerStyle={{
                  width: '100%',
                  height: '100%',
                }}
                renderItem={({item}) => {
                  return (
                    <Pressable
                      onPress={() => {
                        if (isConnect) {
                          setUpdateWantItem(item);
                          setOpenUpdate(true);
                        }
                      }}
                      onLongPress={() => {
                        if (isConnect) {
                          setDeleteWantItem(item);
                          setOpenDelete(true);
                        }
                      }}
                      style={{
                        width: '95%',
                        minHeight: 90,
                        backgroundColor: 'rgb(66, 165, 245)',
                        margin: '2.5%',
                        padding: 10,
                        borderRadius: 10,
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        position: 'relative',
                      }}>
                      <Text style={styles.text}>
                        ต้องการซื้อ {item['name']}
                      </Text>
                      <Text style={styles.text}>จำนวน {item['Amount']}</Text>
                      {item['Comment'] == '' ? (
                        <></>
                      ) : (
                        <Text style={styles.text}>
                          หมายเหตุ {item['Comment']}
                        </Text>
                      )}
                    </Pressable>
                  );
                }}
              />
            </View>

            {/* 
        
        floating action button
        */}
            {isConnect ? (
              <Pressable
                style={{
                  width: 65,
                  height: 65,
                  position: 'absolute',
                  backgroundColor: 'rgb(66, 165, 245)',
                  bottom: '3%',
                  right: '3%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                onPress={() => {
                  if (isConnect) {
                    setOpenAdd(true);
                  }
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 30,
                    fontWeight: 'bold',
                  }}>
                  +
                </Text>
              </Pressable>
            ) : (
              <></>
            )}
          </>
        )}
      </View>

      {/* Add Page */}
      <View style={openAdd ? styles.Add : styles.addUnvisible}>
        <View
          style={{
            width: '80%',
            maxWidth: 300,
            height: 'auto',
            minHeight: 250,
            maxHeight: 290,
            backgroundColor: 'white',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <View
            style={{
              margin: '5%',
              width: '90%',
              height: '90%',
              alignItems: 'center',
              padding: '5%',
            }}>
            <Text style={{color: 'rgb(66, 165, 245)', fontSize: 25}}>
              {index == indexList[1] ? 'เพิ่มรายการ' : 'เพิ่มในตู้เย็น'}
            </Text>
            <View
              style={{
                height: '90%',
                width: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TextInput
                style={styles.textInput}
                placeholder={
                  index == indexList[1]
                    ? 'สิ่งที่ต้องการซ์้อ'
                    : 'สิ่งที่มีอยู่แล้วในตู้เย็น'
                }
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.textInput}
                placeholder="จำนวน"
                value={amount}
                onChangeText={setAmount}
              />
              {index == indexList[1] ? (
                <TextInput
                  style={styles.textInput}
                  placeholder="หมายเหตุ"
                  value={comment}
                  onChangeText={setComment}
                />
              ) : (
                <></>
              )}
              {canNotSave ? (
                <Text style={{color: 'red'}}>
                  * กรอกข้อมูลสิ่งที่ต้องการซื้อและจำนวน
                </Text>
              ) : (
                <></>
              )}
              <Button
                title="เพิ่ม"
                onPress={async () => {
                  if (isConnect) {
                    await add();
                    checkBeforeAdd();
                    getRf();
                    getWant();
                    if (canSave) {
                      onClose();
                      setOpenAdd(false);
                    }
                  } else {
                    Alert.alert('Internet not connect');
                    onClose();
                    setOpenAdd(false);
                  }
                }}
              />
            </View>
          </View>

          <Pressable
            style={{position: 'absolute', top: '2%', right: 15}}
            onPress={() => {
              setOpenAdd(false);
              onClose();
              console.log(update);
            }}>
            <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
              X
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Delete item page */}
      <View style={openDelete ? styles.Add : styles.addUnvisible}>
        <View
          style={{
            width: '80%',
            maxWidth: 300,
            height: 'auto',
            minHeight: 200,
            maxHeight: 200,
            backgroundColor: 'white',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <View
            style={{
              margin: '5%',
              width: '90%',
              height: '90%',
              alignItems: 'center',
              padding: '5%',
              justifyContent: 'space-evenly',
            }}>
            <Text style={{color: 'rgb(66, 165, 245)', fontSize: 25}}>
              ต้องการลบหรือไม่
            </Text>
            <Text>
              {index == indexList[1]
                ? deleteWantItem['name']
                : deleteRfItem['name']}
            </Text>
            <Button
              title="ลบ"
              onPress={() => {
                if (isConnect) {
                  if (index == indexList[1]) {
                    Delete(deleteWantItem['_id']);
                    getWant();
                    storeData(wantItem, indexList[1]);
                  } else {
                    Delete(deleteRfItem['_id']);
                    getRf();
                    storeData(rfItem, indexList[0]);
                  }
                  setOpenDelete(false);
                } else {
                  Alert.alert('Internet not Connnect');
                  setOpenDelete(false);
                }
              }}></Button>
          </View>
          <Pressable
            style={{position: 'absolute', top: '2%', right: 15}}
            onPress={() => {
              setOpenDelete(false);
            }}>
            <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
              X
            </Text>
          </Pressable>
        </View>
      </View>
      {/* Update Item Page */}
      <View style={openUpdate ? styles.Add : styles.addUnvisible}>
        <View
          style={{
            width: '80%',
            maxWidth: 300,
            height: 'auto',
            minHeight: 250,
            maxHeight: 300,
            backgroundColor: 'white',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <View
            style={{
              margin: '5%',
              width: '90%',
              height: '90%',
              alignItems: 'center',
              padding: '5%',
            }}>
            <Text style={{color: 'rgb(66, 165, 245)', fontSize: 25}}>
              แก้ไขข้อมูล
            </Text>
            <View
              style={{
                height: '90%',
                width: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Text>
                {index == indexList[1]
                  ? updateWantItem['name']
                  : updateRfItem['name']}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={
                  index == indexList[1]
                    ? 'สิ่งที่ต้องการซ์้อ'
                    : 'สิ่งที่มีอยู่แล้วในตู้เย็น'
                }
                value={name}
                onChangeText={setName}
              />
              <Text>
                {index == indexList[1]
                  ? updateWantItem['Amount']
                  : updateRfItem['Amount']}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="จำนวน"
                value={amount}
                onChangeText={setAmount}
              />
              {index == indexList[1] ? (
                <>
                  <Text>{updateWantItem['Comment']}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="หมายเหตุ"
                    value={comment}
                    onChangeText={setComment}
                  />
                </>
              ) : (
                <></>
              )}
              {canNotSave ? (
                <Text style={{color: 'red'}}>
                  * กรอกข้อมูลสิ่งที่ต้องการซื้อและจำนวน
                </Text>
              ) : (
                <></>
              )}
              <Button
                title="แก้ไข"
                onPress={async () => {
                  if (isConnect) {
                    await Update(
                      index == indexList[1]
                        ? updateWantItem['_id']
                        : updateRfItem['_id'],
                    );
                    getRf();
                    getWant();
                    storeData(rfItem, indexList[0]);
                    storeData(wantItem, indexList[1]);
                    if (name != '' || comment != '' || amount != '') {
                      onClose();
                      setOpenUpdate(false);
                    }
                  } else {
                    Alert.alert('Internet not Connnect');
                    setOpenUpdate(false);
                  }
                }}
              />
            </View>
          </View>

          <Pressable
            style={{position: 'absolute', top: '2%', right: 15}}
            onPress={() => {
              setOpenUpdate(false);

              onClose();
              console.log(update);
            }}>
            <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
              X
            </Text>
          </Pressable>
        </View>
      </View>
      {/* 
      
      bottom 
      navigation 

      */}
      <View
        style={{
          flex: 0.8,
          backgroundColor: 'blue',
          width: '100%',
          flexDirection: 'row',
          display: 'flex',
        }}>
        <Pressable
          onPress={() => {
            selectIndex == 0 ? {} : setSelectIndex(0);
          }}
          style={
            index == indexList[0] ? styles.onSelectIndex : styles.notSelectIndex
          }>
          <Text style={styles.text}>{indexList[0]}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            selectIndex == 1 ? {} : setSelectIndex(1);
          }}
          style={
            index == indexList[1] ? styles.onSelectIndex : styles.notSelectIndex
          }>
          <Text style={styles.text}>{indexList[1]}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  onSelectIndex: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderLeftWidth: 0,
    flex: 5,
    backgroundColor: 'rgb(229, 115, 115)',
  },
  notSelectIndex: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderLeftWidth: 0,
    flex: 5,
    backgroundColor: 'rgb(59, 150, 255)',
  },
  Add: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addUnvisible: {
    display: 'none',
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  MainVisible: {
    width: '100%',
    height: '100%',
  },
  MainUnvisible: {
    display: 'none',
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    width: '90%',
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
});

export default App;
