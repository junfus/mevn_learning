<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="records"
      item-key="_id"
      class="elevation-1 pa-3"
      multi-sort
      disable-pagination
      hide-default-footer
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template #activator="{ on, attrs }">
              <v-btn color="blue" dark v-bind="attrs" v-on="on">
                <v-icon dark left>
                  {{ icons.mdiPlus }}
                </v-icon>
                添加
              </v-btn>
            </template>
            <v-form ref="form" lazy-validation>
              <v-card outlined>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-menu
                          v-model="menu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.date"
                              label="请选择日期"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.date"
                            locale="zh-cn"
                            @input="menu = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="editedItem.numbers"
                          :rules="[rules.required, rules.number]"
                          label="数量"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea
                          outlined
                          v-model="editedItem.comments"
                          label="备注"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="gray" text @click="close">
                    取消
                  </v-btn>
                  <v-btn v-show="!!editedIndex" color="blue" text @click="save">
                    确定
                  </v-btn>
                  <v-btn
                    v-show="!!!editedIndex"
                    color="green"
                    text
                    @click="save"
                  >
                    确定
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="400px">
            <v-card elevation="4" outlined>
              <v-card-title>确定要删除这条数据吗?</v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="gray" text @click="closeDelete">
                  取消
                </v-btn>
                <v-btn color="red" text @click="deleteItemConfirm">
                  确定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template #[`item.out`]="{ item }">
        <span>
          {{ item.out ? "出库" : "入库" }}
        </span>
      </template>

      <template #[`item.update`]="{ item }">
        <v-btn small color="green" dark @click="editItem(item)">
          <v-icon dark left>
            {{ icons.mdiUpdate }}
          </v-icon>
          更新
        </v-btn>
      </template>

      <template #[`item.delete`]="{ item }">
        <v-btn small color="red" dark @click="deleteItem(item)">
          <v-icon dark left>
            {{ icons.mdiDelete }}
          </v-icon>
          删除
        </v-btn>
      </template>

      <template slot="body.append">
        <tr>
          <th class="title">合计</th>
          <th class="title"></th>
          <th class="title"></th>
          <th class="title"></th>
          <th class="title">{{ total }}</th>
          <th class="title"></th>
          <th class="title"></th>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import RecordAPI from "../api/api_record";
import CategoryAPI from "../api/api_category";
import moment from "moment";
import { mdiPlus, mdiUpdate, mdiDelete } from "@mdi/js";

export default {
  data: () => ({
    editedIndex: -1,
    dialog: false,
    dialogDelete: false,
    menu: false,
    editedItem: {},
    defaultItem: {
      date: new Date().toISOString().substr(0, 10),
      numbers: "",
      comments: "",
    },
    icons: { mdiPlus, mdiUpdate, mdiDelete },
    title: "",
    headers: [
      { text: "日期", value: "date" },
      { text: "分类", value: "categoryName", sortable: false },
      { text: "出库/入库", value: "out", sortable: false },
      { text: "单位", value: "unit", sortable: false },
      { text: "数量", value: "numbers" },
      { text: "备注", value: "comments" },
      { text: "更新", value: "update", sortable: false },
      { text: "删除", value: "delete", sortable: false },
    ],
    records: [],
    category: {},
    total: 0,
    rules: {
      required: (value) => !!value || "必填!",
      number: (value) => {
        const pattern = /^-?\d+\.?\d*$/;
        return pattern.test(value) || "非法的数字！";
      },
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "添加新纪录" : "修改当前记录";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    pickerDate(val) {
      console.log(val);
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.category = await CategoryAPI.getCategoryById(this.$route.params.cid);
      this.title =
        this.category.name + (this.category.out ? "出库" : "入库") + "明细";

      this.records = await RecordAPI.getAllRecordsByCategory(
        this.$route.params.cid
      );
      this.records.forEach((element) => {
        element.date = moment(element.date).format("YYYY-MM-DD");
        element.category = this.category._id;
        element.categoryName = this.category.name;
        element.out = this.category.out;
        element.unit = this.category.unit;
        this.total += parseFloat(element.numbers);
      });
    },

    moment: function() {
      return moment();
    },

    editItem(item) {
      this.editedIndex = this.records.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          // update record
          const body = {
            date: this.editedItem.date,
            numbers: this.editedItem.numbers,
            comments: this.editedItem.comments,
          };

          await RecordAPI.updateRecord(this.editedItem._id, body);
          Object.assign(this.records[this.editedIndex], this.editedItem);
          this.updateTotal();
        } else {
          // create record
          const body = {
            date: this.editedItem.date,
            category: this.category._id,
            numbers: this.editedItem.numbers,
            comments: this.editedItem.comments,
          };
          const result = await RecordAPI.createRecord(body);
          result.date = moment(result.date).format("YYYY-MM-DD");
          result.categoryName = this.category.name;
          result.out = this.category.out;
          result.unit = this.category.unit;

          this.records.push(result);
          this.updateTotal();
        }
        this.close();
      }
    },

    deleteItem(item) {
      this.editedIndex = this.records.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      // delete record
      await RecordAPI.deleteRecord(this.editedItem._id);

      this.records.splice(this.editedIndex, 1);
      this.closeDelete();
      this.updateTotal();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    updateTotal() {
      this.total = 0;
      this.records.forEach((element) => {
        this.total += parseFloat(element.numbers);
      });
    },
  },
};
</script>
