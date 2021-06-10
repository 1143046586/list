/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {View, Text, Button} from 'react-native';
import List from './List';

const MyApp = () => {
  const [height, setHeight] = useState(200);
  const changeHeight = useCallback(() => {
    setHeight(height => height * 2);
  }, []);
  const rendRow = (rowIndex: number, data: any) => {
    if (rowIndex % 2 === 1) {
      return (
        <View
          style={{
            height: rowIndex === 101 ? height : 200,
            // borderWidth: 1,
            borderColor: '#0f0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>listguggh {rowIndex}</Text>
          <Button title="change Height" onPress={changeHeight}>
            change Height
          </Button>
        </View>
      );
    }
    return (
      <View
        style={{
          height: 100 + (rowIndex % 10) * 10,
          // borderWidth: 1,
          borderColor: '#0f0',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          flexWrap: 'wrap',
        }}>
        <Text>listguggh {rowIndex}</Text>
        <Text>lish {rowIndex}</Text>
        <Text>
          {/* {new Array(1000000)
            .fill(1)
            .map(item => item * 100)
            .slice(0, 2)
            .join('')} */}
        </Text>
        {new Array(30).fill(0).map((item, index) => (
          <View key={index} style={{width: 50}}>
            <Text>{index}</Text>
          </View>
        ))}
        <Text>listguggh {rowIndex}</Text>
        <Text>listguggh {rowIndex}</Text>
        <Text>listguggh {rowIndex}</Text>
      </View>
    );
  };
  return (
    <View style={{height: '100%', backgroundColor: '#f00'}}>
      <Text>MyApp</Text>
      <List dataSource={new Array(50000).fill(0)} rendRow={rendRow} />
    </View>
  );
};

export default MyApp;
