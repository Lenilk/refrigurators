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

let App = () => {
  let [openAdd, setOpenAdd] = useState(false);
  let [selectIndex, setSelectIndex] = useState(0);
  let indexList = ['Refrigurator', 'Want'];
  let index = indexList[selectIndex];
  let [name, setName] = useState('');
  let [amount, setAmount] = useState('');
  let [comment, setComment] = useState('');
  let canSave = name != '' && amount != '';
  let [canNotSave, setCanNotSave] = useState(false);
  let [errorText, setErrorText] = useState('');
  let [rfItem, setRfItem] = useState(
    Array<{name: String; Amount: String; _id: React.Key}>,
  );
  let [wantItem, setWantItem] = useState(
    Array<{name: String; Amount: String; _id: React.Key; Comment: String}>,
  );
  let [loading, setLoading] = useState(true);
  useEffect(() => {
    getRf();
    getWant();
    setTimeout(() => {
      getRf();
      getWant();
    }, 10000);
  }, []);
  const Delete = async () => {};
  const getWant = async () => {
    let responseWant: any = await axios
      .get('http://192.168.1.208:3000/getWant')
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
    setWantItem(data);
    setLoading(false);
  };
  const getRf = async () => {
    let responseRf: any = await axios
      .get('http://192.168.1.208:3000/getRf')
      // .then(function (response) {
      //   console.log(response.data);
      // })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    const data: Array<{name: String; Amount: String; _id: React.Key}> =
      responseRf.data;
    setRfItem(data);
    setLoading(false);
  };
  const add = async () => {
    if (canSave) {
      if (index == indexList[1]) {
        await axios
          .post('http://192.168.1.208:3000/postWant', {
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
          .post('http://192.168.1.208:3000/postRf', {
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

      {/* 
      First Page
      */}
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
            <View
              style={
                index == 'Refrigurator'
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
                  <View
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
                  </View>
                )}
              />
            </View>

            <View
              style={
                index == 'Want' ? styles.MainVisible : styles.MainUnvisible
              }>
              <FlatList
                data={wantItem}
                contentContainerStyle={{
                  width: '100%',
                  height: '100%',
                }}
                renderItem={({item}) => (
                  <Pressable
                    style={{
                      width: '95%',
                      minHeight: 90,
                      backgroundColor: 'rgb(66, 165, 245)',
                      margin: '2.5%',
                      padding: 10,
                      borderRadius: 10,
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.text}>ต้องการซื้อ {item['name']}</Text>
                    <Text style={styles.text}>จำนวน {item['Amount']}</Text>
                    <Text style={styles.text}>หมายเหตุ {item['Comment']}</Text>
                  </Pressable>
                )}
              />
            </View>

            {/* 
        
        floating action button
        */}
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
                setOpenAdd(true);
                console.log(rfItem);
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
              {index == indexList[1]
                ? 'เพิ่มสิ่งที่ต้องการซื้อ'
                : 'เพิ่มสิ่งที่มีอยู่ในตู้เย็น'}
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
                  index == 'Want'
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
                  await add();
                  checkBeforeAdd();
                  console.log(`error:${errorText}`);
                  if (await errorText) {
                    Alert.alert(errorText);
                    console.log(errorText);
                  } else {
                    console.log(errorText);
                    getRf();
                    getWant();
                    if (canSave) {
                      onClose();
                      setOpenAdd(false);
                    }
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
