<template>
  <div class="village-page">
    <!-- Tab切换 -->
    <div class="village-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="v-tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 列表内容 -->
    <div class="village-list">
      <NoticeItem
        v-for="item in filteredItems"
        :key="item.id"
        :title="item.title"
        :summary="item.summary"
        :date="item.date"
        :source="item.source"
        :pinned="item.pinned"
        @click="showDetail(item)"
      />
      <div v-if="filteredItems.length === 0" class="empty-state">
        <span class="empty-icon">📭</span>
        <p>暂无相关信息</p>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div class="modal-overlay" v-if="selectedItem" @click.self="selectedItem = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedItem.title }}</h3>
          <button class="modal-close" @click="selectedItem = null">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-meta">
            <span class="detail-tag">{{ activeTab }}</span>
            <span>{{ selectedItem.date }}</span>
            <span>来源：{{ selectedItem.source }}</span>
          </div>
          <div class="detail-content">
            <p>{{ selectedItem.summary }}</p>
            <p style="margin-top: 16px; line-height: 1.8;">{{ selectedItem.detail }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NoticeItem from '../components/NoticeItem.vue'

const activeTab = ref('通知公告')
const selectedItem = ref(null)

const tabs = ['通知公告', '政策法规', '补贴信息', '办事指南']

const allItems = [
  // 通知公告
  { id: 1, category: '通知公告', title: '关于2026年度耕地地力保护补贴发放的通知', summary: '根据上级文件精神，现就2026年度耕地地力保护补贴发放工作通知如下，请符合条件的农户及时到村委会登记确认。', detail: '一、补贴对象：拥有耕地承包权的种地农民。\n二、补贴标准：每亩补贴约110元。\n三、发放时间：2026年6月底前。\n四、发放方式：通过"一卡通"直接发放到户。\n五、登记时间：即日起至5月31日。\n六、注意事项：请携带身份证、土地承包经营权证到村委会登记。', date: '2026-05-06', source: '村委会', pinned: true },
  { id: 2, category: '通知公告', title: '春季防火安全提醒', summary: '春季风干物燥，是火灾事故高发期，请广大村民注意用火安全，防范森林火灾。', detail: '一、严禁在田间地头焚烧秸秆。二、祭祀扫墓注意用火安全，做到人走火灭。三、不要在林区吸烟、野炊。四、发现火情及时拨打119报警。五、积极参与防火巡查。', date: '2026-05-04', source: '村委会', pinned: false },
  { id: 3, category: '通知公告', title: '关于开展2026年度新农合缴费的通知', summary: '2026年度新型农村合作医疗缴费工作已开始，请广大村民在规定时间内完成缴费。', detail: '一、缴费标准：每人400元/年。\n二、缴费时间：2026年5月1日至6月30日。\n三、缴费方式：可通过微信、支付宝或到村委会现场缴费。\n四、享受待遇：住院报销比例最高可达75%。', date: '2026-05-02', source: '村委会', pinned: true },
  { id: 4, category: '通知公告', title: '村东灌溉渠清淤施工通知', summary: '为确保夏季灌溉顺利进行，将对村东灌溉渠进行清淤施工，施工期间请合理安排灌溉时间。', detail: '施工时间：2026年5月10日至5月20日。\n施工路段：村东头灌溉主干渠。\n注意事项：施工期间请使用村西机井灌溉，或错峰灌溉。', date: '2026-05-01', source: '村委会', pinned: false },

  // 政策法规
  { id: 5, category: '政策法规', title: '河南省2026年强农惠农政策汇编', summary: '汇总2026年河南省出台的各项强农惠农政策，涵盖种粮补贴、农机补贴、保险补贴等方面。', detail: '一、种粮农民直接补贴：每亩不低于110元。\n二、农机购置补贴：最高补贴35%。\n三、农业保险补贴：保费由政府承担85%。\n四、高标准农田建设：每亩补助1600元。\n五、新型职业农民培训：免费培训，每人补助1200元。', date: '2026-04-20', source: '省农业厅', pinned: true },
  { id: 6, category: '政策法规', title: '农村宅基地管理办法（最新版）', summary: '最新修订的农村宅基地管理办法，明确宅基地申请条件、审批流程和使用规范。', detail: '一、申请条件：本村集体经济组织成员，无宅基地或面积不达标。\n二、审批流程：个人申请→村组公示→乡镇审核→县级审批。\n三、面积标准：人均不超过30平方米。\n四、禁止行为：严禁买卖、非法转让宅基地。', date: '2026-04-15', source: '自然资源局', pinned: false },
  { id: 7, category: '政策法规', title: '农村土地流转政策解读', summary: '详细解读农村土地承包经营权流转的相关政策，帮助农户了解土地流转的权利和义务。', detail: '一、流转方式：出租、转包、入股、互换。\n二、流转期限：不得超过承包期剩余年限。\n三、流转价格：由双方协商确定，建议参考当地指导价。\n四、合同签订：必须签订书面流转合同。\n五、权益保障：流转后承包权不变，流转收益归承包方所有。', date: '2026-04-10', source: '农业农村局', pinned: false },

  // 补贴信息
  { id: 8, category: '补贴信息', title: '2026年实际种粮农民一次性补贴发放公告', summary: '根据中央财政安排，向实际种粮农民发放一次性补贴，以应对农资价格上涨。', detail: '一、补贴对象：实际承担农资成本的种粮农民。\n二、补贴标准：每亩约18元。\n三、发放方式：通过"一卡通"直接发放。\n四、发放时间：2026年5月底前。\n五、咨询电话：12316。', date: '2026-05-03', source: '财政局', pinned: true },
  { id: 9, category: '补贴信息', title: '农机报废更新补贴政策', summary: '老旧农机报废可申请补贴，同时购买新农机可享受购置补贴，双重优惠。', detail: '一、报废补贴标准：拖拉机最高补贴1.8万元，收割机最高补贴2.5万元。\n二、申请条件：农机使用年限超过规定年限。\n三、办理流程：申请→鉴定→报废→补贴。\n四、咨询电话：0371-12345678。', date: '2026-04-25', source: '农机局', pinned: false },
  { id: 10, category: '补贴信息', title: '2026年危房改造补贴申请通知', summary: '农村危房改造补贴开始申请，符合条件的农户可获补助资金1-4万元。', detail: '一、补助对象：农村低保户、分散供养特困人员、脱贫户等。\n二、补助标准：C级修缮加固1.2万元，D级拆除重建2-4万元。\n三、申请方式：到村委会填写申请表。\n四、截止时间：2026年6月30日。', date: '2026-04-18', source: '住建局', pinned: false },

  // 办事指南
  { id: 11, category: '办事指南', title: '农村低保申请办理指南', summary: '详细介绍农村最低生活保障的申请条件、所需材料和办理流程。', detail: '一、申请条件：家庭人均收入低于当地低保标准。\n二、所需材料：身份证、户口本、收入证明、家庭财产证明。\n三、办理流程：申请→入户调查→民主评议→张榜公示→审批。\n四、办理地点：乡镇民政所。\n五、办理时限：30个工作日。', date: '2026-04-28', source: '民政局', pinned: true },
  { id: 12, category: '办事指南', title: '农村养老保险参保缴费指南', summary: '农村居民养老保险参保缴费档次、补贴标准和待遇领取说明。', detail: '一、参保对象：16周岁以上非在校学生。\n二、缴费档次：每年200-5000元，共15个档次。\n三、政府补贴：缴200元补35元，缴500元补70元，以此类推。\n四、待遇领取：60周岁后按月领取养老金。\n五、办理方式：到村委会或乡镇社保所办理。', date: '2026-04-22', source: '社保局', pinned: false },
  { id: 13, category: '办事指南', title: '准生证办理流程及所需材料', summary: '一胎、二胎生育登记（准生证）的办理流程和所需材料清单。', detail: '一、办理条件：夫妻双方至少一方为本省户籍。\n二、所需材料：双方身份证、户口本、结婚证。\n三、办理地点：乡镇计生办或线上办理。\n四、办理时限：即时办理。\n五、温馨提示：建议怀孕3个月内办理。', date: '2026-04-15', source: '计生办', pinned: false }
]

const filteredItems = computed(() => {
  return allItems.filter(item => item.category === activeTab.value)
})

const showDetail = (item) => {
  selectedItem.value = item
}
</script>

<style scoped>
.village-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Tab切换 */
.village-tabs {
  display: flex;
  background: var(--bg-white);
  border-radius: var(--radius);
  padding: 6px;
  box-shadow: var(--shadow);
}

.v-tab {
  flex: 1;
  padding: 12px 8px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  transition: var(--transition);
  min-height: 44px;
}

.v-tab.active {
  background: var(--primary-green);
  color: #fff;
  font-weight: 600;
}

/* 列表 */
.village-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--text-light);
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: var(--bg-white);
  border-radius: var(--radius);
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background: var(--bg-white);
  z-index: 1;
}

.modal-header h3 {
  font-size: 17px;
  font-weight: 600;
  flex: 1;
  margin-right: 12px;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-light);
  font-size: 18px;
  flex-shrink: 0;
}

.modal-body {
  padding: 20px;
}

.detail-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.detail-tag {
  padding: 2px 10px;
  background: #E8F5E9;
  color: var(--primary-green);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.detail-content {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.8;
  white-space: pre-line;
}

@media (max-width: 767px) {
  .v-tab {
    font-size: 13px;
    padding: 10px 4px;
  }
}
</style>
