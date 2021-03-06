/*變數宣告 */
let startDate, endDate, totalDay 
let monthBill, dayBill, personDayBill, payable
let shareNumberOfPeople, airConPeople
let payables = {
    water: 0,
    gas: 0,
    pubPower: 0,
    total: function () {
        return this.water + this.gas + this.pubPower
    }
}
let airTenants = []
let target 

/*抓取DOM節點*/
let waterInputPanel = document.querySelector("#waterInput")
let gasInputPanel = document.querySelector("#gasInput")

let airConTitle = document.querySelector("#airConTitle")
let airConData = document.querySelector("#airCon")
let publicPowerTitle = document.querySelector("#publicPowerTitle")
let publicPowerData = document.querySelector("#publicPower")

let noAirBillTable = document.querySelector("#noAir table tbody")
let airBillPanel = document.querySelector("#Air")

/*設置監聽器*/

waterInputPanel.addEventListener("click", computing)
gasInputPanel.addEventListener("click", computing)

airConTitle.addEventListener("click", displayAirConPanel)
airConData.addEventListener("click", computingAir)
publicPowerTitle.addEventListener("click", displayPublicPowerPanel)
publicPowerData.addEventListener("click" , finallyResult)

/*function*/

//#region 計算水費、瓦斯費
//計算每人應付的水費、瓦斯費為多少
function computing() {
    target = event.target
    let inputTr = this.parentElement.children[0].children[0].children[0].children 
    let outPutTbody = this.parentElement.children[1].children[0].children[0]
    let title = this.parentElement.previousElementSibling.innerHTML

    startDate = inputTr[0].children[1].children[0].value
    endDate = inputTr[1].children[1].children[0].value
    monthBill = inputTr[2].children[1].children[0].value
    shareNumberOfPeople = inputTr[3].children[1].children[0].value

    if (target.classList.contains("btn")) {
        if (!startDate || !endDate || !monthBill || !shareNumberOfPeople) {
            alert("輸入欄位不得空白，無法計算，請重新選擇日期及輸入資料後再點擊計算")
        }
        else if (startDate > endDate) {
            alert("開始日期不得大於結束日期，請重新選擇開始日期")
        }
        else {
            //計算輸出結果並顯示在網頁
            totalDay = parseInt(Math.abs(new Date(startDate) -new Date(endDate)) / 1000 / 60 / 60 / 24 +1)
            dayBill = Math.round(monthBill / totalDay * 10) / 10
            personDayBill = Math.round(dayBill / shareNumberOfPeople * 10) / 10
            payable = Math.ceil(monthBill / shareNumberOfPeople)

            outPutTbody.children[0].children[1].innerHTML = totalDay+"天"
            outPutTbody.children[1].children[1].innerHTML = "$"+dayBill
            outPutTbody.children[2].children[1].innerHTML = "$"+personDayBill
            outPutTbody.children[3].children[1].innerHTML = "$" + payable
            //公用變數必須清空
            startDate = null
            endDate = null
            monthBill = null
            shareNumberOfPeople = null
        }
    }
    //payables對應key賦值
    if (title === "水費") {
        payables.water = payable
    }
    else if (title === "瓦斯費") {
        payables.gas = payable
    }
}
//#endregion

//#endregion 計算冷氣費用
function displayAirConPanel() {
    target = event.target
    airConPeople = this.children[2].value
    let airConPanel = this.nextElementSibling

    if (target.classList.contains("btn")) {
        if (airConPeople < 0 || airConPeople === "") {
            alert("冷氣人數錯誤或是空白！若無人使用請輸入0，不得空白，請重新輸入使用冷氣人數")
        }
        else {
            if (airConPeople == 0) {
                airTenants = []
            }
            airConPanel.innerHTML = displayAirCon(airConPeople)
        }
    }
}

function displayAirCon(airConPeople) {
    let htmlContent = ''
    for (let i = 0; i < airConPeople; i++) {
        htmlContent += 
            `<div  class="row m-0">
                    <section class="col-md border border-dark airConPowerInput">
                        <table class="table text-nowrap">
                            <tbody>
                                <tr>
                                    <td class="text-right">租客姓名：</td>                                   
                                    <td ><input type="text" /></td>
                                </tr>
                                <tr>
                                    <td class="text-right">上期總度數：</td>                                   
                                    <td ><input type="text" /></td>
                                </tr>
                                <tr>
                                    <td class='text-right'>目前總度數：</td>
                                    <td ><input type="text" /></td>
                                </tr>
                                <tr>
                                    <td class='text-right'>目前電價(元/度)：</td>
                                    <td><input type="text"></td>
                                </tr>                            
                            </tbody>
                        </table>
                        <button class='btn btn-outline-danger btn-block mb-3'>計算</button>
                    </section>
                    <section  class="col-md border border-dark airConPowerOutput">
                        <p class="text-center pt-3 pb-2">租客</p>
                        <table class="table text-nowrap">
                            <tbody>
                                <tr>
                                    <td class="text-right">本期使用總度數：</td>                                   
                                    <td class="text-center"></td>
                                </tr>
                                <tr>
                                    <td class='text-right'>本期應付冷氣費：</td>
                                    <td class="text-center payable"></td>
                                </tr>                         
                            </tbody>
                        </table>
                    </section>
             </div>`
    }
    return htmlContent
}

function computingAir() {
    target = event.target
    if (target.classList.contains("btn")) {
        let airTenant = {
            name: "",
            preDegree: 0,
            curDegree: 0,
            curPowerPrice: 0,
            useDegree: function () {
                return parseInt(this.curDegree - this.preDegree)
            },
            airPower: function () {
                return Math.ceil(this.useDegree() * this.curPowerPrice)
            }
        }
        let airConChild = target.parentElement.parentElement
        let airConChildIndex = Array.from(this.children).indexOf(airConChild) //與Array.from(airConChild.parentElement.children).indexOf(airConChild)相同

        let airConInput = target.parentElement
        let airConInputTr = airConInput.children[0].children[0].children
        let airConOutput = airConInput.nextElementSibling
        let airConOutputTr = airConOutput.children[1].children[0].children

        airTenant.name = airConInputTr[0].children[1].children[0].value
        airTenant.preDegree = airConInputTr[1].children[1].children[0].value
        airTenant.curDegree = airConInputTr[2].children[1].children[0].value
        airTenant.curPowerPrice = airConInputTr[3].children[1].children[0].value

        if (!airTenant.name || !airTenant.preDegree || !airTenant.curDegree || !airTenant.curPowerPrice) {
            alert("輸入資料不得空白，請重新輸入後在點擊計算")
        }
        else if (airTenant.preDegree > airTenant.curDegree) {
            alert("上期度數不應大於目前總度數，請重新確認後輸入！")
        }
        else {
            airConOutput.children[0].innerHTML = airTenant.name
            airConOutputTr[0].children[1].innerHTML = airTenant.useDegree()
            airConOutputTr[1].children[1].innerHTML = "$"+airTenant.airPower()

            airTenants[airConChildIndex] = airTenant
        }
    }
}
//#endregion

//#region 計算公用電費與最終結果
function displayPublicPowerPanel() {
    target = event.target
    let powerBill = this.children[2].value
    let pubPowerPanel = this.nextElementSibling
    let totalAir = 0
    let totalpubPower

    if (airTenants.length != 0) {
        airTenants.forEach(airTenant => {
            totalAir += airTenant.airPower()
        })
    }

    totalpubPower = parseInt( powerBill - totalAir)
    if (target.classList.contains("btn")) {
        if (totalpubPower < 0) {
            alert("您輸入的總電費有誤，請重新輸入！")
        }
        else {
            pubPowerPanel.innerHTML = displayPubPower(totalpubPower)
        }
    }  
}

function displayPubPower(totalpubPower) {
    let htmlContent =
        `<section id="publicPowerInput" class="col-sm border border-dark">
            <table class="table text-nowrap">
                <tbody>
                    <tr>
                        <td class="text-right">開始日期：</td>                                   
                        <td class="startDate"><input  type="date" name="date" class="form-control"/></td>
                    </tr>
                    <tr>
                        <td class="text-right">結束日期：</td>                                   
                        <td class="endDate"><input  type="date" name="date" class="form-control"/></td>
                    </tr>
                    <tr>
                        <td class='text-right'>公用電費：</td>
                        <td class="text-center">$${totalpubPower}</td>
                    </tr>
                    <tr>
                        <td class='text-right'>分攤人數：</td>
                        <td><input type="text"></td>
                    </tr>                            
                </tbody>
            </table>
            <button class='btn btn-outline-danger btn-block mb-3'>計算</button>
        </section>
        <section id="publicPowerOutput" class="col-sm border border-dark">
            <table class="table text-nowrap">
                <tbody>
                    <tr>
                        <td class="text-right">總天數：</td>
                        <td class="text-center"></td>
                    </tr>
                    <tr>
                        <td class="text-right">公用電費/天：</td>                                   
                        <td class="text-center"></td>
                    </tr>
                    <tr>
                        <td class='text-right'>公用電費/每天每人：</td>
                        <td class="text-center"></td>
                    </tr>
                    <tr>
                        <td class='text-right'>每人應付公用電費：</td>
                        <td class="text-center text-danger"></td>
                    </tr>                            
                </tbody>
            </table>
        </section>`
    return htmlContent
}


function finallyResult() {
    target = event.target
    let pubPowerInput = this.children[0]
    let inputTr = pubPowerInput.children[0].children[0].children
    let pubPowerOutput = this.children[1]
    let outputTr = pubPowerOutput.children[0].children[0].children

    if (target.classList.contains("btn")) {
        startDate = inputTr[0].children[1].children[0].value
        endDate =  inputTr[1].children[1].children[0].value
        monthBill = inputTr[2].children[1].innerHTML.substring(1)
        shareNumberOfPeople = inputTr[3].children[1].children[0].value

        if (!startDate || !endDate || !monthBill || !shareNumberOfPeople) {
            alert("輸入欄位不得空白，無法計算，請重新選擇日期及輸入資料後再點擊計算")
        }
        else if (startDate > endDate) {
            alert("開始日期不得大於結束日期，請重新選擇開始日期")
        }
        else {
            totalDay = parseInt(Math.abs( new Date(startDate) -new Date(endDate)) / 1000 / 60 / 60 / 24 +1)
            dayBill = Math.round(monthBill / totalDay * 10) / 10
            personDayBill = Math.round(dayBill / shareNumberOfPeople * 10) / 10
            payable = Math.ceil(monthBill / shareNumberOfPeople)

            outputTr[0].children[1].innerHTML = totalDay + "天"
            outputTr[1].children[1].innerHTML = "$" + dayBill
            outputTr[2].children[1].innerHTML = "$" + personDayBill
            outputTr[3].children[1].innerHTML = "$" + payable

            payables.pubPower = payable
            dispalyEveryoneTotalBill()

            startDate = null
            endDate = null
            monthBill = null
            shareNumberOfPeople = null
        }
    }
}

function dispalyEveryoneTotalBill() {
    noAirBillTable.children[0].children[1].innerHTML = payables.water
    noAirBillTable.children[1].children[1].innerHTML = payables.gas
    noAirBillTable.children[2].children[1].innerHTML = payables.pubPower
    noAirBillTable.children[3].children[1].innerHTML = payables.total()

    airBillPanel.innerHTML = displayAirBill(airTenants)
}

function displayAirBill(airTenants) {
    let htmlContent = ""
    airTenants.forEach(airTenant => {
        htmlContent += 
            `<section class="col-md border border-dark">
                <p class="text-center pt-3">${airTenant.name}</p>
                <table class="table text-nowrap">
                    <tbody>
                        <tr>
                            <td class="text-right">本期應繳水費：</td>
                            <td class="text-center">${payables.water}</td>
                        </tr>
                        <tr>
                            <td class="text-right">本期應繳瓦斯費：</td>
                            <td class="text-center">${payables.gas}</td>
                        </tr>
                        <tr>
                            <td class="text-right">本期應繳公用電費：</td>
                            <td class="text-center">${payables.pubPower}</td>
                        </tr>
                        <tr>
                            <td class="text-right">本期應繳冷氣電費：</td>
                            <td class="text-center">${airTenant.airPower()}</td>
                        </tr>
                        <tr>
                            <td class="text-right">合計：</td>
                            <td class="text-center text-danger">${payables.total() + airTenant.airPower()}</td>
                        </tr>
                    </tbody>
                </table>
            </section>`
    })
    return htmlContent
}
//#endregion