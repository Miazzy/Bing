import { useState } from 'react';
import moment from 'moment';
import { Icon, message, Modal, Radio, Button } from 'antd';
import request from '@/util/request';
import { getQueryFromUrl } from '@/util/stringHelper';
import download from '@/util/download';
import styles from './index.css';

let init = false;
const queryDate = getQueryFromUrl('date');

export default function() {
  const [img, setImg] = useState({});
  const [imgList, setImgList] = useState([]);
  const [date, setDate] = useState(moment().format('YYYYMMDD'));
  const [downModal, setDownModal] = useState({ show: false, type: 'pc', size: '1920x1080' });

  // 更新日期，从接口获取数据
  const updateDate = async (val = date) => {
    setDate(val);

    // 选择了查询前五天和后五天的数据
    const res = await request({
      api: 'getList',
      data: { date: val, before: 5, after: 5 }
    });

    res.data.forEach((item) => {
      if (!imgList.find((o) => o.date === item.date))
        imgList.push(item);
    });

    setImgList(imgList.sort((a, b) => a.date - b.date));
    const imgObj = imgList.find((o) => o.date === Number(val));

    // 如果有这一天的数据
    if (imgObj)
      return setImg(imgObj);

    // 如果这一天没有数据，但是接口里有返回
    if (imgList[0] && imgList[0].date)
      return updateDate(imgList[0].date);

    // 这种情况一般不会发生，除非你把电脑时间该到了比较未来
    if (val === moment().format('YYYYMMDD')) {
      setImg({});
      return message.warning('你问题大的很呀！');
    }

    // 一般是选择了比较未来或者比较之前的时间，发现没有数据，还是选择今天的数据吧
    updateDate(moment().format('YYYYMMDD'));
  };

  // 更新下载弹窗
  const updateDownModal = (key, val, val2) => {
    const obj = {
      ...downModal,
      [key]: val,
    };

    if (key === 'type')
      obj.size = val2;

    setDownModal(obj)
  };

  // 初始化
  if (!init) {
    init = true;
    updateDate(queryDate || undefined);
  }

  // 当前图片在图片list 中的位置
  const index = imgList.findIndex((o) => o.date === img.date);
  // 位置更新
  const changePosition = (i) => updateDate(imgList[i].date);

  window.onkeydown = ({ keyCode }) => {
    switch (keyCode) {
      case 37:
        if (index === 0) {
          message.warning('没有更早的啦');
          return false;
        }
        return changePosition(index - 1);
      case 39:
        if (index === imgList.length - 1) {
          message.warning('没有更新的啦');
          return false;
        }
        return changePosition(index + 1);
      default: break;
    }
  };

  const imgDate = moment(img.date, 'YYYYMMDD');

  return (
    <div className={styles['img-container']}>
      { img.date && (
        <div className={styles['img-content-box']}>
          <div className={styles['img-content']}>
            <img className={styles['img-pic']} src={`//cn.bing.com${img.url}`}/>
          </div>
          <div className={styles['img-info']}>
            <div className={styles['img-date']}>
              <div className={styles['img-date-year']}>{imgDate.format('YY')}</div>
              <div className={styles['img-date-md']}>
                <div>{imgDate.format('MM')}</div>
                <div>{imgDate.format('DD')}</div>
              </div>
            </div>
            <div className={styles['img-cp']}><div className={styles['img-cp-txt']}>{img.cp}</div></div>
          </div>

          {/* 上一页、下一页 */}
          {
            index !== 0 &&
            <div className={styles['icon-left']} onClick={() => changePosition(index - 1)}>
              <Icon type="left" />
            </div>
          }
          {
            index !== (imgList.length - 1) &&
            <div className={styles['icon-right']} onClick={() => changePosition(index + 1)}>
              <Icon type="right" />
            </div>
          }

          <div className={styles['bottom-icons']}>
            <div className={styles['bottom-icon-item']}>
              <i className="iconfont icon-about"></i>
            </div>
            <div className={styles['bottom-icon-item']}>
              <i className="iconfont icon-download" onClick={() => updateDownModal('show', true)}></i>
            </div>
          </div>
        </div>
      )}

      <Modal
        visible={downModal.show}
        footer={false}
        width={700}
        onCancel={() => updateDownModal('show', false)}
      >
        <div>
          <div className={styles['down-img-container']}>
            <img src={`//cn.bing.com${img.urlbase}_${downModal.size}.jpg`} alt=""/>
          </div>
          <div className="size-select-container">
            <div className={styles['size-select']}>
              <i
                className="iconfont icon-pc"
                style={{ color: {pc: '#3089dc', mobile: '#999'}[downModal.type] }}
                onClick={() => updateDownModal('type', 'pc', '1920x1080')}
              />

              <Radio.Group
                value={downModal.size}
                onChange={(e) => updateDownModal('type', 'pc', e.target.value)}
                style={{ marginLeft: '10px' }}
              >
                <Radio.Button value="1920x1200">1920x1200</Radio.Button>
                <Radio.Button value="1920x1080">1920x1080</Radio.Button>
                <Radio.Button value="1366x768">1366x768</Radio.Button>
                <Radio.Button value="1280x768">1280x768</Radio.Button>
                <Radio.Button value="1024x768">1024x768</Radio.Button>
              </Radio.Group>
            </div>
            <div className={styles['size-select']}>
              <i
                className="iconfont icon-mobile"
                style={{ color: {mobile: '#3089dc', pc: '#999'}[downModal.type] }}
                onClick={() => updateDownModal('type', 'mobile', '768x1280')}
              />

              <Radio.Group
                value={downModal.size}
                onChange={(e) => updateDownModal('type', 'mobile', e.target.value)}
                style={{ marginLeft: '10px' }}
              >
                <Radio.Button value="768x1280">768x1280</Radio.Button>
                <Radio.Button value="720x1280">720x1280</Radio.Button>
                <Radio.Button value="480x800">480x800</Radio.Button>
              </Radio.Group>
            </div>
            <div style={{ paddingLeft: '25px' }}>
              <Button
                type="primary"
                onClick={() => download(`//cn.bing.com${img.urlbase}_${downModal.size}.jpg`, `bing-${imgDate.format('YYYY-MM-DD')}.jpg`)}
              >
                <i className="iconfont icon-download" />下载</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
