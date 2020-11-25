function(args) {
/*
/Users/fquraish/yazz/a.accdb
is_app(true)
component_type("VB")
display_name("ms_excel client control")
description("This will return the ms_excel control")
base_component_id("ms_excel_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "excel_file_path",
            name:   "ms_excel file path",
            design_time_only_events: true,
            //type:   "File",
            type:   "String"
        }
        ,
        {
            id:     "design_time_text",
            name:   "Design Time Text",
            type:   "String",
            default: "Microsoft Excel control",
            help:       `<div>Help text for
                            <b>text</b> property
                         </div>`
        }

        ,
        {
            id:     "result",
            name:   "result",
            type:   "Array",
            default:    []
        }
        ,
        {
            id:         "runQuery",
            pre_snippet: `await `,
            snippet:    `runQuery()`,
            name:       "runQuery",
            type:       "Action",
            help:       `<div>Help text for
                            <b>runQuery</b> function
                            <div>The SQL is store in the "sql" property</div>
                         </div>`
        }
        ,

        {
            id:     "getSheets",
            pre_snippet: `await `,
            name:   "getSheets()",
            snippet:    `getSheets()`,
            type:   "Action"
        }
        ,
        {
            id:     "getSheetDetails",
            name:   "getSheetDetails('SHEET_NAME')",
            type:   "Action"
        }
        ,
        {
            id:     "connect",
            pre_snippet: `await `,
            name:   "connect",
            type:   "Action"
        }
        ,
        {
            id:     "getWorkbook",
            pre_snippet: `await `,
            name:   "getWorkbook()",
            snippet:    `getWorkbook()`,
            type:   "Action"
        }
        ,

        {
            id:     "getColumns",
            name:   "getColumns",
            type:   "Action"
        }
        ,

        {
            id:         "design_mode_table",
            name:       "Design Table",
            type:       "String",
            default:    "",
            hidden:     true
        }
        ,
        {
            id:     "on_property_changed",
            name:   "on_property_changed",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`,
            default: `
                if (property == "excel_file_path") {
                  await me.connect();
              }
`
        }
        ,
        {
            id:         "isExcelAvailable",
            name:       "Is Excel Available?",
            type:       "Select",
            default:    "False",
            values:     [
                            {display: "True",   value: "True"},
                            {display: "False",  value: "False"}
                        ]
                        ,
            design_time_only_events: true
        }
        ,

        {
            id:     "getSheet",
            name:   "getSheet",
            type:   "Action"
        }
        ,
        {
            id:         "has_details_ui",
            name:       "Has details UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,

        {
            id:     "sheet",
            name:   "Sheet",
            type:   "String"
        }
        ,

        {
            id:     "rowCount",
            name:   "Row Count",
            type:   "Number"
        }
        ,

        {
            id:     "colCount",
            name:   "Column Count",
            type:   "Number"
        }
    ]
)//properties
logo_url("/driver_icons/excel.png")
*/
    Vue.component("ms_excel_control",{
        props: [  "meta",  "args",  "properties",  "name",  "refresh",  "design_mode"  ]
        ,
        template: `<div v-bind:style='"white-space:normal;height:100%;width:100%; border: 0px;" '>
                                    <div v-if="design_mode  && (!(design_mode == 'detail_editor')) ">
                                                {{properties.design_time_text}}
                                    </div>

                                    <div v-bind:style='"height:100%;width:100%; border: 0px;color:black;padding: 10px;"'
                                         v-if='design_mode == "detail_editor"'
                                          >

                                        <div v-bind:style='"height:100%;width:100%; overflow: none;"'>

                                            <ul class="nav nav-pills" v-bind:style='"height:20%;width:100%; overflow: none;"'>
                                                <li class="nav-item" style="width:20%;">
                                                    <a  v-bind:class='"nav-link " + ((designDetailTab == "connection")?"active":"")'
                                                        v-on:click="designDetailTab = 'connection';"
                                                        href="#">
                                                        Data source connection
                                                    </a>
                                                </li>

                                                <li class="nav-item" style="width:20%;">
                                                    <a    v-bind:class='"nav-link " + ((designDetailTab == "sheets")?"active":"")'
                                                          v-on:click="designDetailTab = 'sheets';"
                                                          href="#">Sheets</a>
                                                </li>

                                                <li class="nav-item" style="width:20%;">
                                                    <a    v-bind:class='"nav-link " + ((designDetailTab == "tabular_data")?"active":"")'
                                                          v-on:click="designDetailTab = 'tabular_data';"
                                                          href="#">Find table data</a>
                                                </li>

                                            </ul>

                                            <div v-bind:style='((designDetailTab == "connection")?"visibility:visible;":"visibility:hidden;display: none;")'
                                                 v-bind:refresh='refresh'>

                                                Connection

                                                <div   v-if='properties.isExcelAvailable == "True"'
                                                       style="background-color: green; color: white;padding:10px;">
                                                    Connected
                                                </div>

                                                <div   v-if='!(properties.isExcelAvailable == "True")'
                                                       style="background-color: red; color: white;padding:10px;">
                                                    Not Connected
                                                </div>
                                            </div>






                                            <div v-bind:style='((designDetailTab == "sheets")?"visibility:visible;":"visibility:hidden;display: none;")'
                                                 v-bind:refresh='refresh'>

                                                <div   v-for='thisSheetName in sheetNames'
                                                       v-on:click="sheetName = thisSheetName;selectSheet(sheetName)"
                                                       v-bind:style='"padding: 5px; " + ((sheetName == thisSheetName)?"background-color:gray;color:white;":"background-color:white;color:gray;") '>

                                                      {{thisSheetName}}

                                                </div>

                                            </div>






                                            <div v-bind:style='((designDetailTab == "tabular_data")?"visibility:visible;":"visibility:hidden;display: none;")'
                                                 v-bind:refresh='refresh'>

                                                Sheet "{{sheetName}}" ({{properties.colCount}} cols, {{properties.rowCount}} rows)
                                                <div   v-for='rowIndex in Array.from(Array(30).keys())'
                                                      >

                                                    <span   v-for='colIndex in Array.from(Array(properties.colCount).keys())'
                                                          >

                                                        {{sheetData[getColRowString(colIndex,rowIndex)]?sheetData[getColRowString(colIndex,rowIndex)].v:""}},

                                                    </span>


                                                </div>
                                            </div>


                                        </div>
                                    </div>



                 </div>`
        ,
        data: function() {
            return {
                sheetData:                 { },
                sheetDetails:              { },
                sheetNames:                [ ],
                sheetName:                  null,
                workbook:                   null,
                designDetailTab:           "connection"
            }
        }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh(newValue, oldValue) {
              if (isValidObject(this.args)) {
                  //this.design_time_text = this.args.design_time_text
              }
          }
        },
        mounted: async function() {
            registerComponent(this)

              await this.connect()
              await this.getWorkbook()
              await this.getSheets()
        }
        ,
        methods: {



            getSheets: async function() {
              let mm = this
              console.log("In getSheets")

              let result=null

              result = mm.workbook.SheetNames
             //debugger

             //alert("runQuery: " + JSON.stringify(result,null,2))
             //console.log(JSON.stringify(result,null,2))
             let retTables = []
             if (result) {
                 this.sheetNames   = []
                 this.sheetDetails = {}
                 //alert(JSON.stringify(result,null,2))
                 for (var i=0;i<result.length;i++) {
                     this.sheetNames.push(result[i])
                     this.sheetDetails[result[i]] = {name: result[i]}
                 }
             }
             //debugger
             return this.sheetNames
            }
            ,




            getSheetDetails: function(sheetName)
            {
                return this.sheetDetails[sheetName]
            }
            ,






            getColumns: async function() {
                console.log("In getColumns")

                if (this.design_mode) {
                    var result = await callFunction(
                                        {
                                            driver_name: "excel_server",
                                            method_name: "excel_sql"  }
                                            ,{
                                                path:            this.properties.excel_file_path,
                                                get_columns:     true,
                                                table:           this.args.design_mode_table
                                             })



                   //alert("runQuery: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   let retTables = []
                   if (result) {
                       this.args.columns = []
                       //alert(JSON.stringify(result,null,2))
                       for (var i=0;i<result.length;i++) {
                           this.args.columns.push(result[i])
                           retTables.push(result[i])

                       }
                   }

                   return retTables
                }
            }
            ,



            connect: async function() {
                let mm = this
                try {
                    var result = await callFunction(
                                        {
                                            driver_name: "excel_server",
                                            method_name: "excel_sql"  }
                                            ,{
                                                connect:         true,
                                                path:            this.properties.excel_file_path
                                             })
                    if (result.err) {
                        mm.properties.isExcelAvailable = "False"
                        return false
                    } else {
                        mm.properties.isExcelAvailable = "True"
                        return true
                    }
                } catch (catchErr) {
                    mm.properties.isExcelAvailable = "False"
                    return false
                }
            }
            ,






            getWorkbook: async function() {
                let mm = this

                if (mm.properties.isExcelAvailable == "True") {
                  try {
                      var result = await callFunction(
                                          {
                                              driver_name: "excel_server",
                                              method_name: "excel_sql"  }
                                              ,{
                                                  get_workbook:     true,
                                                  path:             this.properties.excel_file_path
                                               })
                      if (result.err) {
                          mm.properties.isExcelAvailable = "False"
                          return {error: true}
                      } else {
                          mm.properties.isExcelAvailable = "True"
                          mm.workbook = XLSX.utils.book_new();
                          let sheetNames = Object.keys(result.value)
                          for (let sheetIndex=0 ; sheetIndex < sheetNames.length; sheetIndex++) {
                              let sheetName = sheetNames[sheetIndex]
                              const ws = XLSX.utils.json_to_sheet(result.value[sheetName]);
                              XLSX.utils.book_append_sheet(mm.workbook, ws, sheetName);
                          }

                          return result.value
                      }
                  } catch (catchErr) {
                      mm.properties.isExcelAvailable = "False"
                      return {error: true}
                  }

                }
            }
            ,







            runQuery: async function() {
                if (!this.design_mode) {
                    var result = await callFunction(
                                        {
                                            driver_name: "excel_server",
                                            method_name: "excel_sql"  }
                                            ,{
                                                get_data:        true,
                                                table:           this.properties.select_table,
                                                path:            this.properties.excel_file_path
                                             })


                   //alert("runQuery: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result) {

                        //select_columns
                        this.args.result  = []
                        for (let rownum=0; rownum<result.length; rownum++) {
                            let origrow = result[rownum]
                            let outputRow = {}
                            //debugger
                            if (this.properties.select_columns && (this.properties.select_columns.length  >  0)) {
                                for (let i = 0; i < this.properties.select_columns.length; i++) {
                                    let thisColName = this.properties.select_columns[i].name
                                    outputRow[  thisColName  ] = origrow[  thisColName  ]
                                  }
                            } else {
                                outputRow = origrow
                            }
                                this.args.result.push(  outputRow  )
                        }

                        return this.args.result
                   }


               }
                this.args.result = []
                this.changedFn()
                return {}
            }
            ,
            changedFn: function() {
                if (isValidObject(this.args)) {
                    //this.args.text = this.text

                }
            }
            ,

            getSheet: async function() {
                var result = await callFunction(
                                    {
                                        driver_name: "excel_server",
                                        method_name: "excel_sql"  }
                                        ,{
                                            get_data:        true,
                                            table:           this.properties.select_table,
                                            path:            this.properties.excel_file_path
                                         })


               //alert("runQuery: " + JSON.stringify(result,null,2))
               console.log(JSON.stringify(result,null,2))
               if (result) {

                    //select_columns
                    this.args.result  = result
                    return this.args.result
               }


                this.args.result = []
                this.changedFn()
                return {}
            }
            ,








            selectSheet(aSheet) {
              let mm = this
              mm.sheetData = mm.workbook.Sheets[aSheet]
              let range = XLSX.utils.decode_range(mm.sheetData['!ref']);
              mm.properties.rowCount = range.e.r
              mm.properties.colCount = range.e.c
              debugger
            }
            ,
            getColRowString(col, row) {
                      let startColNumber = "A".charCodeAt(0);
                      let colCharNumber = startColNumber + col
                      let colChar = String.fromCharCode(colCharNumber)
                      let result = "" + colChar + (row  + 1)
                      return result

            }



        }
    })
}
