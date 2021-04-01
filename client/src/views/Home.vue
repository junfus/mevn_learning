<template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <span class="title headline black--text">表格</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-row class="pa-3">
        <v-col cols="3" v-for="item in categories" :key="item._id">
          <v-card
            elevation="1"
            class="pa-1"
            :to="{ name: 'record', params: { cid: item._id } }"
          >
            <v-card-title>
              {{ item.name + (item.out ? "出库表" : "入库表") }}
            </v-card-title>
            <v-divider class="mx-4"></v-divider>
            <v-card-text>
              <div class="title">合计: {{ totalMap[item._id] }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import CategoryAPI from "../api/api_category";
import RecordAPI from "../api/api_record";

export default {
  data() {
    return {
      categories: [],
      records: [],
      totalMap: {},
    };
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.records = await RecordAPI.getAllRecords();

      this.records.forEach((element) => {
        if (!this.totalMap[element.category]) {
          this.totalMap[element.category] = 0.0;
        }
        this.totalMap[element.category] += parseFloat(element.numbers);
      });

      this.categories = await CategoryAPI.getAllCategories();
    },
  },
};
</script>
