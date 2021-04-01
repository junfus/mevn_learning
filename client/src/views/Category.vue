<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="categories"
      item-key="_id"
      class="elevation-1 pa-3"
      multi-sort
      disable-pagination
      hide-default-footer
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>表名</v-toolbar-title>
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
                      <v-col cols="12" sm="6" md="12">
                        <v-text-field
                          outlined
                          v-model="editedItem.name"
                          label="名称"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          outlined
                          v-model="editedItem.unit"
                          label="单位"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col class="d-flex" cols="12" sm="6" md="6">
                        <v-select
                          :items="outItems"
                          item-text="text"
                          item-value="value"
                          v-model="editedItem.out"
                          label="出/入库"
                          outlined
                        ></v-select>
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
    </v-data-table>
  </v-container>
</template>

<script>
import { mdiPlus, mdiUpdate, mdiDelete } from "@mdi/js";
import CategoryAPI from "../api/api_category";

export default {
  data() {
    return {
      editedIndex: -1,
      dialog: false,
      dialogDelete: false,
      menu: false,
      editedItem: {},
      defaultItem: {
        name: "",
        unit: "",
        out: true,
        comments: "",
      },
      icons: { mdiPlus, mdiUpdate, mdiDelete },
      headers: [
        { text: "名称", value: "name" },
        { text: "单位", value: "unit" },
        { text: "出库/入库", value: "out" },
        { text: "备注", value: "comments" },
        { text: "更新", value: "update", sortable: false },
      ],
      outItems: [
        { text: "出库", value: true },
        { text: "入库", value: false },
      ],
      categories: [],
      rules: {
        required: (value) => !!value || "必填!",
      },
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "添加新表" : "修改当前表";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.categories = await CategoryAPI.getAllCategories();
    },

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
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
            name: this.editedItem.name,
            unit: this.editedItem.unit,
            out: this.editedItem.out,
            comments: this.editedItem.comments,
          };

          await CategoryAPI.updateCategory(this.editedItem._id, body);
          Object.assign(this.categories[this.editedIndex], this.editedItem);
        } else {
          // create record
          const body = {
            name: this.editedItem.name,
            unit: this.editedItem.unit,
            out: this.editedItem.out,
            comments: this.editedItem.comments,
          };

          const result = await CategoryAPI.createCategory(body);
          this.categories.push(result);
        }
        this.close();
      }
    },
  },
};
</script>
