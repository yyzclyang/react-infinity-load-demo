import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import './app.css';
import Box from './box';

interface BoxData {
  order: number;
  data: number;
}

const App = () => {
  const [boxData, setBoxData] = React.useState<Array<number>>(() =>
    Array.from(new Array(30)).map((item, index) => index)
  );
  const [displayBoxStartIndex, setDisplayBoxStartIndex] = React.useState<
    number
  >(0);
  const [displayBoxData, setDisplayBoxData] = React.useState<Array<BoxData>>(
    () =>
      boxData
        .slice(displayBoxStartIndex, displayBoxStartIndex + 10)
        .map((item) => ({ order: item, data: item }))
  );

  const [wrapperMarginTop, setWrapperMarginTop] = React.useState<number>(0);
  const [hadDisplayBoxMaxIndex, setHadDisplayBoxMaxIndex] = React.useState<
    number
  >(displayBoxData[displayBoxData.length - 1].order);
  const [wrapperMarginBottom, setWrapperMarginBottom] = React.useState<number>(
    0
  );
  const [boxHeightArr, setHeightElArr] = React.useState<Array<number>>([]);

  const scrollFn = React.useCallback(() => {
    const scrollDis =
      document.documentElement.scrollTop || document.body.scrollTop;
    const viewHeight =
      document.documentElement.clientHeight || document.body.clientHeight;

    const one_nine_boxHeight = boxHeightArr.reduce((result, item, index) => {
      if (index < 9) {
        return result + item;
      }
      return result;
    }, 0);
    if (scrollDis + viewHeight > one_nine_boxHeight + wrapperMarginTop) {
      // 增加一条数据
      if (displayBoxStartIndex + 10 >= boxData.length) {
        setBoxData((arr) => [...arr, displayBoxStartIndex + 10]);
      }
      setDisplayBoxStartIndex((index) => index + 1);
      window.scrollTo({
        top: scrollDis
      });
      console.log('add');
    }
    if (
      scrollDis < wrapperMarginTop + boxHeightArr[displayBoxStartIndex] &&
      displayBoxStartIndex > 0
    ) {
      setDisplayBoxStartIndex((index) => index - 1);
      console.log('delete');
    }
  }, [
    boxHeightArr,
    displayBoxStartIndex,
    boxData,
    displayBoxData,
    wrapperMarginTop
  ]);

  React.useEffect(() => {
    setWrapperMarginBottom(() => {
      return boxHeightArr.reduce((result, item, index) => {
        if (
          index >= displayBoxStartIndex + 10 &&
          index <= hadDisplayBoxMaxIndex
        ) {
          return result + item;
        }
        return result;
      }, 0);
    });
  }, [hadDisplayBoxMaxIndex, displayBoxStartIndex, boxHeightArr]);
  React.useEffect(() => {
    setDisplayBoxData(() =>
      boxData
        .slice(displayBoxStartIndex, displayBoxStartIndex + 10)
        .map((item) => ({ order: item, data: item }))
    );
    setWrapperMarginTop(() => {
      return boxHeightArr.reduce((result, item, index) => {
        if (index < displayBoxStartIndex) {
          return result + item;
        }
        return result;
      }, 0);
    });
    setHadDisplayBoxMaxIndex((preMaxIndex) =>
      preMaxIndex < displayBoxStartIndex + 10
        ? displayBoxStartIndex + 10
        : preMaxIndex
    );
  }, [displayBoxStartIndex, boxHeightArr, boxData]);
  React.useEffect(() => {
    window.addEventListener('scroll', scrollFn);
    return () => {
      window.removeEventListener('scroll', scrollFn);
    };
  }, [
    boxHeightArr,
    displayBoxStartIndex,
    boxData,
    displayBoxData,
    wrapperMarginTop
  ]);

  return (
    <div className="page">
      <div
        className="wrapper"
        style={{
          marginTop: wrapperMarginTop,
          marginBottom: wrapperMarginBottom
        }}
      >
        {displayBoxData.map((item) => (
          <Box
            key={item.order}
            style={{
              backgroundColor: item.order % 2 === 0 ? 'pink' : 'orange'
            }}
            saveRef={(el) => {
              setHeightElArr((arr) => {
                const newArr = [...arr];
                newArr[item.order] = el.getBoundingClientRect().height;
                return newArr;
              });
            }}
            callback={() => {}}
          >
            {item.data}
          </Box>
        ))}
      </div>
    </div>
  );
};

export default hot(App);
