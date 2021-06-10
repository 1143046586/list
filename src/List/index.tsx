/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
interface ListProps {
  dataSource: any[];
  rendRow: (rowIndex: number, data: any) => JSX.Element;
  itemNum?: number;
  endItemNum?: number;
}
interface Position {
  height: number;
  y: number;
}
const windowHeight = Dimensions.get('window').height;

let beforeTime = new Date().getTime();

const List = (props: ListProps) => {
  let {dataSource, rendRow, itemNum = 50, endItemNum = 20} = props;
  endItemNum = endItemNum > itemNum / 2 ? itemNum / 2 : endItemNum;
  const [startIndex, setStartIndex] = useState<number>(0);
  const [updateList, setUpdateList] = useState<number>(0);
  const positions = useRef<Position[]>([]);
  const timer = useRef<any>(null);
  const layoutQueue = useRef<{index: number; height: number}[]>([]);
  const onLayout = useCallback(
    (index: number, e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height;
      if (
        positions.current[index] &&
        positions.current[index].height === height
      ) {
        return;
      }
      layoutQueue.current.push({index, height});

      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const allPosition = positions.current;
        for (let i = layoutQueue.current[0].index; i < dataSource.length; i++) {
          const currentPosition = layoutQueue.current[
            i - layoutQueue.current[0].index
          ]
            ? layoutQueue.current[i - layoutQueue.current[0].index]
            : allPosition[i];
          if (!currentPosition) {
            positions.current = allPosition;
            setUpdateList(num => num + 1);
            layoutQueue.current = [];
            return;
          }
          const beforeViewPosition = allPosition[i - 1]
            ? allPosition[i - 1]
            : {height: 0, y: 0};
          allPosition[i] = {
            height: currentPosition.height,
            y: beforeViewPosition.y + beforeViewPosition.height,
          };
        }
        positions.current = allPosition;
        setUpdateList(num => num + 1);
        layoutQueue.current = [];
      }, 1);
    },
    [dataSource.length],
  );

  const onScroll = useCallback(
    (evt: NativeSyntheticEvent<NativeScrollEvent>) => {
      const startY = evt.nativeEvent.contentOffset.y;
      const endY = startY + windowHeight;
      const scrollV = evt.nativeEvent.velocity;
      const direction = scrollV && scrollV.y > 0 ? 'down' : 'up';
      const allPosition = positions.current;

      if (
        direction === 'down' &&
        allPosition[startIndex + itemNum - endItemNum] &&
        allPosition[startIndex + itemNum - endItemNum].y < endY
      ) {
        setStartIndex(index => index + Math.round(itemNum / 2));
      } else if (
        direction === 'up' &&
        allPosition[startIndex + endItemNum] &&
        allPosition[startIndex + endItemNum].y > startY
      ) {
        setStartIndex(index =>
          index - Math.round(itemNum / 2) > 0
            ? index - Math.round(itemNum / 2)
            : 0,
        );
      }
    },
    [endItemNum, itemNum, startIndex],
  );

  const nowTime = new Date().getTime();
  console.log('render', nowTime - beforeTime);
  beforeTime = nowTime;
  const lastPosition = positions.current[positions.current.length - 1];
  return (
    <ScrollView
      scrollEventThrottle={50}
      onScroll={onScroll}
      style={{
        position: 'relative',
        flex: 1,
        backgroundColor: '#f60',
        borderWidth: 1,
        borderColor: '#0f0',
      }}>
      <View
        style={{
          height: lastPosition ? lastPosition.y + lastPosition.height : '100%',
        }}>
        {new Array(itemNum).fill(0).map((_, index) => {
          const indexPosition = positions.current[startIndex + index];
          // console.log(startIndex + index, indexPosition);

          return (
            <View
              key={index}
              onLayout={e => onLayout(startIndex + index, e)}
              style={{
                position: 'absolute',
                width: '100%',
                zIndex: 1,
                left: 0,
                ...(indexPosition
                  ? {top: indexPosition.y}
                  : {bottom: 0, opacity: 0}),
              }}>
              {rendRow(startIndex + index, dataSource[startIndex + index])}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default List;
