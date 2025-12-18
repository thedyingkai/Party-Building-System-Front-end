<template>
  <div>
    <div class="row-a1">
      <div class="wp wpimp" style="margin-top:60px;margin-bottom:60px">
        <div class="oh">
          <div class="col_l">
            <ImgCarousel :carouselItems="carouselData" carouselHeight="380px"/>
          </div>
          <ArticleListWithTitle :column-list="columnLists[0]"></ArticleListWithTitle>
        </div>
      </div>
    </div>

<!--    <div class="row-a2">-->
<!--      <div class="wp">-->
<!--        <div class="g-titb2"><img :src=" require('@/assets/img/tzggx.png')" alt=""></div>-->
<!--        <div class="oh">-->
<!--          <ul class="in-notice-list">-->
<!--          </ul>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="row-a3" :style="{ backgroundImage: `url(${require('@/assets/img/c_bg1.jpg')})` }">-->
<!--      <div class="wp1">-->
<!--        <div class="m-titb1">-->
<!--          <a class="dzqhlink" href="https://www.dangjian.tsinghua.edu.cn/djwmk/dzqhy.htm" style="display:block;"-->
<!--             targer="_blank">-->
<!--            <i class="i1"><img :src="require('@/assets/img/p8.png')" alt=""></i>-->
<!--            <i class="i2"><img :src="require('@/assets/img/p10.png')" alt=""></i>-->
<!--            <span>党在电科院</span>-->
<!--            <i class="i1"><img :src="require('@/assets/img/p9.png')" alt=""></i>-->
<!--          </a>-->
<!--        </div>-->
<!--        <div class="m-video">-->
<!--          <div class="videobox">-->
<!--            <video id="myVideo" :src="require('@/assets/img/dj100logoxx.jpg')" class="video"-->
<!--                   playsinline="true"-->
<!--                   poster="@/assets/img/dzqhpic.png" webkit-playsinline="true">-->
<!--            </video>-->
<!--            <a class="play js-play" href="javascript:;">-->
<!--            </a>-->
<!--          </div>-->
<!--          <div class="name">党在电科院之又红又专人才的摇篮</div>-->
<!--        </div>-->
<!--        <ul class="ul-listb2">-->
<!--          <li>-->
<!--            <div class="con">-->

<!--              <div class="tit">{{ columnLists[2][0].name }}-->
<!--                <router-link :to="{ name: 'ArticleShow', params: { id:columnLists[2][0].id } }" class="qhgd"-->
<!--                             style="color: #ffffff">-->
<!--                </router-link>-->
<!--              </div>-->
<!--              <ArticleListWithTitle :coid="columnLists[2][0].id" :show-date="false"-->
<!--                                    :page-size="3" :table-type="transparentClass"></ArticleListWithTitle>-->
<!--            </div>-->
<!--          </li>-->
<!--          <li>-->
<!--            <div class="con">-->
<!--              <div class="tit">电科院党史<a class="qhgd" href="qhdzzjl95zn/qhds.htm"></a></div>-->
<!--              <ArticleListWithTitle :coid="columnLists[2][0].id" :show-date="false"-->
<!--                                    :page-size="3" :table-type="transparentClass"></ArticleListWithTitle>-->
<!--            </div>-->
<!--          </li>-->

<!--          <li>-->
<!--            <div class="con">-->
<!--              <div class="tit">时代先锋<a class="qhgd" href="qhdzzjl95zn/sdxf.htm"></a></div>-->
<!--              <ArticleListWithTitle :coid="columnLists[2][0].id" :show-date="false"-->
<!--                                    :page-size="3" :table-type="transparentClass"></ArticleListWithTitle>-->
<!--            </div>-->
<!--          </li>-->
<!--          <li>-->
<!--            <div class="con">-->
<!--              <div class="tit">电科院文化<a class="qhgd" href="qhdzzjl95zn/qhwh.htm"></a></div>-->
<!--              <ArticleListWithTitle :coid="columnLists[2][0].id" :show-date="false"-->
<!--                                    :page-size="3" :table-type="transparentClass"></ArticleListWithTitle>-->
<!--            </div>-->
<!--          </li>-->

<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="row-a4">-->
<!--      <div class="wp">-->
<!--        <div class="g-titb2"><img :src=" require('@/assets/img/t4.png')" alt=""></div>-->
<!--        <div class="oh">-->
<!--          <div class="col_l">-->
<!--            <ArticleListWithTitle :coid="columnLists[1][0].id"></ArticleListWithTitle>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="row-a5">-->
<!--      <div class="wp">-->
<!--        <div class="g-titb2"><img :src=" require('@/assets/img/dszlx.png')" alt=""></div>-->
<!--        <ul class="ul-listb4">-->
<!--          <li>-->
<!--            <div class="conbox">-->
<!--              <div class="tit">经典著作</div>-->
<!--              <a class="first"-->
<!--                 href="https://preview-pdf.xuexi.cn/preview/index.html?url=https%3A%2F%2Fpreview-pdf.xuexi.cn%2F5c25d850c754ed2f7c075f9e%2Fl5pyuhddtv9.pdf&copy=1"-->
<!--                 target="_blank">-->
<!--                <div class="pic">-->
<!--                  <img :src=" require('@/assets/img/ccccc_bg1.png')" alt="马克思恩格斯文集资料汇编">-->
<!--                </div>-->
<!--                <div class="name">马克思恩格斯文集资料汇编</div>-->
<!--              </a>-->
<!--              <div class="box">-->
<!--                <ArticleListWithTitle :coid="columnLists[3][0].id" :show-date="false"-->
<!--                                      :page-size="3" :bottom-button="true"></ArticleListWithTitle>-->
<!--              </div>-->
<!--            </div>-->
<!--          </li>-->
<!--          <li>-->
<!--            <div class="conbox">-->
<!--              <div class="tit">党史讲坛</div>-->
<!--              <a class="first" href="info/1018/7728.htm">-->
<!--                <div class="pic">-->
<!--                  <img :src=" require('@/assets/img/dsjtjt.jpg')" alt="张红宇：巩固和拓展脱贫攻坚成果——解读中国脱贫@.">-->
<!--                </div>-->
<!--                <div class="name">张红宇：巩固和拓展脱贫攻坚成果——解读中国脱贫@.</div>-->
<!--              </a>-->
<!--              <div class="box">-->
<!--                <ArticleListWithTitle :coid="columnLists[3][1].id" :show-date="false"-->
<!--                                      :page-size="3" :bottom-button="true"></ArticleListWithTitle>-->
<!--              </div>-->
<!--            </div>-->
<!--          </li>-->
<!--          <li>-->
<!--            <div class="conbox">-->
<!--              <div class="tit">榜样力量</div>-->
<!--              <a class="first" href="info/1019/7658.htm">-->
<!--                <div class="pic">-->
<!--                  <img alt="郑德荣：毕生践信仰 矢志向真理"-->
<!--                       src="http://p2.img.cctvpic.com/photoworkspace/contentimg/2018/07/16/2018071606505729464.jpg">-->
<!--                </div>-->
<!--                <div class="name">郑德荣：毕生践信仰 矢志向真理</div>-->
<!--              </a>-->
<!--              <div class="box">-->
<!--                <ArticleListWithTitle :coid="columnLists[3][2].id" :show-date="false"-->
<!--                                      :page-size="3" :bottom-button="true"></ArticleListWithTitle>-->
<!--              </div>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="row-a6">-->
<!--      <div class="wp">-->
<!--        <div class="g-titb2"><img :src=" require('@/assets/img/t6.png')" alt=""></div>-->
<!--        <div class="m-links">-->


<!--          <div class="l">-->
<!--            <a class="pic1" href="info/1008/10132.htm">-->
<!--              <div class="img"-->
<!--                   :style="{ backgroundImage: `url(${require('@/assets/img/8311F99E17AEC4BF65D29D421BB_CB7AE3DB_D5E1.jpg')})` }"></div>-->
<!--              <div class="bot">-->
<!--                <div class="name">《电科院学子讲党史》：科学家精神</div>-->
<!--              </div>-->
<!--            </a>-->
<!--          </div>-->
<!--          <div class="oh">-->

<!--            <a class="pic1" href="info/1008/10131.htm">-->
<!--              <div class="img"-->
<!--                   :style="{ backgroundImage: `url(${require('@/assets/img/8311F99E17AEC4BF65D29D421BB_CB7AE3DB_D5E1.jpg')})` }"></div>-->
<!--              <div class="bot">-->
<!--                <div class="name">《电科院学子讲党史》：劳模精神</div>-->
<!--              </div>-->
<!--            </a>-->
<!--            <a class="pic1" href="info/1008/10130.htm">-->
<!--              <div class="img"-->
<!--                   :style="{ backgroundImage: `url(${require('@/assets/img/8311F99E17AEC4BF65D29D421BB_CB7AE3DB_D5E1.jpg')})` }"></div>-->
<!--              <div class="bot">-->
<!--                <div class="name">《电科院学子讲党史》：马克思主义中国化的三次飞跃</div>-->
<!--              </div>-->
<!--            </a>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="row-a1">
      <div class="wp">
        <div class="g-titb2"><img :src=" require('@/assets/img/tt66.png')" alt=""></div>
        <div class="oh" style="    padding-bottom: 30px;">
          <div class="col_l dyzss">
            <div class="m-banb1"><img :src=" require('@/assets/img/dyzsss.jpg')" style="width:100%;"></div>
          </div>
          <div class="oh pt7">


            <ul class="g-listb1 dyzs">

              <li>
                <div class="con">
                  <div class="date">11-24</div>
                  <h3><a href="https://www.tsinghua.edu.cn/info/1177/88829.htm" style="font-weight:bold;">电科院青年学子集体学习党的十九届六中全会精神</a>
                  </h3>
                  <p>
                    11月8日至11日，中国共产党第十九届中央委员会第六次全体会议在北京胜利举行。全会听取和讨论了习近平总书记受中央政治局委托作的工作报告，充分肯定党的十九届五中全会以来中央政治局的工作，审议通过了《中共中央关于党的百年奋斗重大成就和历史经验的决议》，审议通过了《关于召开党的第二十次全国代表大会的决议》。电科院大学青年学子高度关注大会的召开，第一时间学习党的十九届六中全会精神，反响热烈。</p>
                </div>
              </li>


              <li>
                <div class="con">
                  <div class="date">11-24</div>
                  <h3><a href="https://www.tsinghua.edu.cn/info/1177/88851.htm" style="font-weight:bold;">电科院大学“石榴籽计划”研究生同学热议党的十九届六中全会精神</a>
                  </h3>
                  <p>
                    11月8日至11日，中国共产党第十九届中央委员会第六次全体会议胜利举行。全会听取和讨论了习近平总书记受中央政治局委托作的工作报告，充分肯定党的十九届五中全会以来中央政治局的工作，审议通过了《中共中央关于党的百年奋斗重大成就和历史经验的决议》，审议通过了《关于召开党的第二十次全国代表大会的决议》。12日，中共中央举行新闻发布会，介绍党的十九届六中全会精神并回答记者问题。电科院大学第五期“石榴籽计划”少数民族研究生同学在线上观看了本次会议的直播，认真学习了全会精神，在发布会后纷纷表达自己的感想。</p>
                </div>
              </li>


              <li>
                <div class="con">
                  <div class="date">11-24</div>
                  <h3><a href="https://www.tsinghua.edu.cn/info/1177/85699.htm" style="font-weight:bold;">电科院大学党委理论学习中心组集体学习习近平总书记在庆祝中国共产党成立100@.</a>
                  </h3>
                  <p>
                    7月2日上午，电科院大学党委理论学习中心组在工字厅举行集体学习会，学习习近平总书记在庆祝中国共产党成立100周年大会和“七一勋章”颁授仪式上的重要讲话精神。校党委书记陈旭主持学习会，校党委副书记、校长邱勇等中心组成员参加学习。会上，中心组成员原原本本研读了习近平总书记的重要讲话，围绕重要讲话的重要意义、核心内涵、精神实质分享了学习体会，并就结合学校工作实际贯彻落实进行了深入研讨。</p>
                </div>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import ImgCarousel from "@/components/ImgCarousel";
import ArticleListWithTitle from "@/components/ArticleListWithTitle";

export default {
  name: "DefaultView",
  components: {
    ArticleListWithTitle,
    ImgCarousel,
  },
  data() {
    return {
      carouselData: [
      ],
      columnLists: [
        [{id: 4, name: '主题专栏',}, {id: 5, name: '党建活动',}],
        [{id: 2, name: '理论专栏',}],
        [{id: 17, name: '党建基层巡礼'},],
        [{id: 11, name: '经典著作'}, {id: 14, name: '党史讲堂'}, {id: 16, name: '榜样力量'},]
      ],
      transparentClass: 'transparent-table',
    }
  },
  created() {
    this.$request.get('/homePic/all').
    then(res => {
      this.carouselData=res.data;
    });
  },
}
</script>

<style scoped>
@import "../../assets/css/style.css";
@import "../../assets/css/index.vsb.css";
@import "../../assets/css/slick.css";

.ul-listb2 li {
  width: 50%;
}

.dzqhlink:hover span {
  color: #f1d677;
}

@media screen and (max-width: 767px) {
  .g-titb2 img {
    margin-left: -45%;
    max-width: 198%;
  }
}

</style>