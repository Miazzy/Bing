import pay1 from '@/assets/pay-1.png'
import pay2 from '@/assets/pay-2.jpeg'
import './index.scss';

export default function () {
  return (
    <div className="about-page">
      <h2>关于 必应壁纸 <a target="_blank" href="https://github.com/jsososo/Bing"><i className="icon-github iconfont" /></a></h2>
      <p>
        Bing 壁纸很好看不是嘛，如果有一个能回顾之前每一天的必应壁纸就更好啦，所以就诞生了这个网站～
      </p>
      <p>
        后端目前还没开源，因为比较简单，是一个 nodejs 项目，每天定时从必应接口
        （<a target="_blank" href="http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&nc=1553500237029&pid=hp">http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&nc=1553500237029&pid=hp</a>）
        获取数据然后保存。（很丢人，目前存储方式为每天保存一份 json 文件，都没用数据库）
      </p>
      <p>
        同时个人精力有限，自适应什么的也还没怎么做，有空补上！
      </p>
      <p>
        有问题、建议欢迎 issue，pr 走起 <a target="_blank" href="https://github.com/jsososo/Bing">https://github.com/jsososo/Bing</a>
      </p>
      <p>
        如果喜欢的话，给个 star 吧，如果很喜欢的话，给点服务器香油钱吧
        <div>
          <img className="img-pay" src={pay1} alt=""/>
          <img className="img-pay" src={pay2} alt=""/>
        </div>
      </p>
    </div>
  )
}
