import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("items");
    return savedItems
      ? JSON.parse(savedItems)
      : [
          {
            number: 1,
            productCode: "",
            qty: 0,
            weight: 0,
            unitPrice: 0,
            unit: "",
            discount: 0,
            finalPrice: 0,
          },
        ];
  });

  const [headerInfo, setHeaderInfo] = useState(() => {
    const savedHeaderInfo = localStorage.getItem("headerInfo");
    return savedHeaderInfo
      ? JSON.parse(savedHeaderInfo)
      : {
          docNumber: "",
          issueDate: "",
          dueDate: "",
          customerName: "",
          billingAddress: "",
          shippingAddress: "",
          referenceDoc: "",
          currency: "",
        };
  });

  const [note, setNote] = useState(() => localStorage.getItem("note") || "");

  const [remark, setRemark] = useState(
    () => localStorage.getItem("remark") || ""
  );

  const [billDiscount, setBillDiscount] = useState(
    () => localStorage.getItem("billDiscount") || "0.00"
  );

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    const item = newItems[index];

    item[field] =
      field === "unit" || field === "productCode"
        ? value
        : parseFloat(value) || 0;

    const priceBeforeDiscount = item.unitPrice * item.qty;
    item.finalPrice =
      priceBeforeDiscount - (priceBeforeDiscount * item.discount) / 100;

    setItems(newItems);
  };

  const handleHeaderInputChange = (field, value) => {
    setHeaderInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNoteChange = (value) => {
    setNote(value);
  };

  const handleRemarkChange = (value) => {
    setRemark(value);
  };

  const handleBillDiscountChange = (value) => {
    setBillDiscount(parseFloat(value) || 0);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        number: items.length + 1,
        productCode: "",
        qty: 0,
        weight: 0,
        unitPrice: 0,
        unit: "",
        discount: 0,
        finalPrice: 0,
      },
    ]);
  };

  const deleteRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    const reindexedItems = updatedItems.map((item, i) => ({
      ...item,
      number: i + 1,
    }));
    setItems(reindexedItems);
  };

  const calculateTotals = () => {
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const totalBeforeDiscount = items.reduce(
      (sum, item) => sum + item.unitPrice * item.qty,
      0
    );
    const totalNetPrice = items.reduce(
      (sum, item) =>
        sum +
        (item.unitPrice - (item.unitPrice * item.discount) / 100) * item.qty,
      0
    );

    const totalAfterBillDiscount = totalNetPrice - billDiscount;
    const totalVat = totalAfterBillDiscount * 0.07;
    const totalGrand = totalAfterBillDiscount + totalVat;

    return {
      totalQty,
      totalWeight,
      totalBeforeDiscount,
      totalNetPrice,
      totalAfterBillDiscount,
      totalVat,
      totalGrand,
    };
  };

  const totals = calculateTotals();

  const handleSave = () => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("headerInfo", JSON.stringify(headerInfo));
    localStorage.setItem("note", note);
    localStorage.setItem("remark", remark);
    localStorage.setItem("billDiscount", billDiscount);
    alert("ดำเนินการ save ข้อมูล");
  };

  const handleCancel = () => {
    localStorage.removeItem("items");
    localStorage.removeItem("headerInfo");
    localStorage.removeItem("note");
    localStorage.removeItem("remark");
    localStorage.removeItem("billDiscount");
    setItems([
      {
        number: 1,
        productCode: "",
        qty: 0,
        weight: 0,
        unitPrice: 0,
        unit: "",
        discount: 0,
        finalPrice: 0,
      },
    ]);
    setHeaderInfo({
      docNumber: "",
      issueDate: "",
      dueDate: "",
      customerName: "",
      billingAddress: "",
      shippingAddress: "",
      referenceDoc: "",
      currency: "",
    });
    setNote("");
    setRemark("");
    setBillDiscount("0.00");
    alert("ดำเนินการลบข้อมูล");
  };

  return (
    <div className="bg-gray-100 w-screen h-screen p-8">
      <div className="bg-white h-full rounded-md border border-gray-300 flex flex-col">
        {/* header info */}
        <div className="headerinfo w-2/3">
          <div className="grid grid-cols-4 gap-5 p-5 text-black">
            <input
              className="col-span-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="หมายเลขเอกสาร"
              value={headerInfo.docNumber}
              onChange={(e) =>
                handleHeaderInputChange("docNumber", e.target.value)
              }
            />
            <input
              className="col-span-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="วันที่ออกเอกสาร"
              value={headerInfo.issueDate}
              onChange={(e) =>
                handleHeaderInputChange("issueDate", e.target.value)
              }
            />
            <input
              className="col-span-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="วันที่ครบกำหนด"
              value={headerInfo.dueDate}
              onChange={(e) =>
                handleHeaderInputChange("dueDate", e.target.value)
              }
            />
            <input
              className="col-span-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="ชื่อลูกค้า"
              value={headerInfo.customerName}
              onChange={(e) =>
                handleHeaderInputChange("customerName", e.target.value)
              }
            />
            <input
              className="col-span-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="ที่อยู่ออกใบกำกับ"
              value={headerInfo.billingAddress}
              onChange={(e) =>
                handleHeaderInputChange("billingAddress", e.target.value)
              }
            />
            <input
              className="col-span-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="ที่อยู่จัดส่ง"
              value={headerInfo.shippingAddress}
              onChange={(e) =>
                handleHeaderInputChange("shippingAddress", e.target.value)
              }
            />
            <input
              className="col-span-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="หมายเลขเอกสารอ้างอิง"
              value={headerInfo.referenceDoc}
              onChange={(e) =>
                handleHeaderInputChange("referenceDoc", e.target.value)
              }
            />
            <input
              className="col-span-1 p-2 bg-white rounded-md border border-gray-300"
              placeholder="Currency"
              value={headerInfo.currency}
              onChange={(e) =>
                handleHeaderInputChange("currency", e.target.value)
              }
            />
          </div>
        </div>

        {/* main */}
        <div className="flex flex-grow">
          {/* order list */}
          <div className="orderlist bg-gray-100 text-black border-t border-r border-gray-300 p-5 flex flex-col w-2/3">
            <p className="text-green-900 font-bold mb-4">รายการสินค้า</p>
            <div className="sticky top-0 bg-gray-200 z-10">
              <table className="table-auto w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="border p-2 w-10">#</th>
                    <th className="border p-2 w-32">รหัสสินค้า</th>
                    <th className="border p-2 w-20 text-right border-r-gray-300">
                      จำนวน
                    </th>
                    <th className="border p-2 w-20  border-r-gray-300 ">
                      น้ำหนัก
                    </th>
                    <th className="border p-2 w-32 text-right">ราคา/หน่วย</th>
                    <th className="border p-2 w-20 text-left">หน่วย</th>
                    <th className="border p-2 w-32 text-center border-r-gray-300">
                      ราคาก่อนส่วนลด
                    </th>
                    <th className="border p-2 w-20 text-center border-r-gray-300">
                      ส่วนลด
                    </th>
                    <th className="border p-2 w-32 text-right">ราคาสุทธิ</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div
              className="h-72 overflow-auto "
              style={{ scrollbarWidth: "none" }}
            >
              <table className="table-auto bg-white w-full border border-gray-300">
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.number} className="group relative">
                      <td className="border p-2 text-center w-10 relative">
                        {item.number}
                        <button
                          onClick={() => deleteRow(index)}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-2 py-1 rounded hidden group-hover:block"
                        >
                          ลบ
                        </button>
                      </td>
                      <td className="border p-2 w-32">
                        <input
                          type="text"
                          className="w-full border p-2 bg-white"
                          value={item.productCode}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "productCode",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="border p-2 text-right w-20">
                        <input
                          type="int"
                          className="w-full border p-2 bg-white text-right"
                          value={item.qty}
                          onChange={(e) =>
                            handleInputChange(index, "qty", e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2  w-20 border-l border-r">
                        <input
                          type="int"
                          className="w-full border p-2 text-center bg-white"
                          value={item.weight}
                          onChange={(e) =>
                            handleInputChange(index, "weight", e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2 text-right w-32">
                        <input
                          type="int"
                          className="w-full border p-2 bg-white text-right"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "unitPrice",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="border p-2 text-center w-20">
                        <select
                          className="w-full border p-2 bg-white"
                          value={item.unit}
                          onChange={(e) =>
                            handleInputChange(index, "unit", e.target.value)
                          }
                        >
                          <option value=""></option>
                          <option value="ชิ้น">ชิ้น</option>
                          <option value="กิโลกรัม">กิโลกรัม</option>
                        </select>
                      </td>
                      <td className="border p-2 text-right w-32">
                        <div className="w-full border p-2 bg-white text-right">
                          {(item.unitPrice * item.qty).toFixed(2)}
                        </div>
                      </td>
                      <td className="border p-2 w-20">
                        <input
                          type="int"
                          className="w-full border p-2 bg-white text-center"
                          value={item.discount}
                          onChange={(e) =>
                            handleInputChange(index, "discount", e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-2 text-right w-32">
                        <div className="w-full border p-2 bg-white text-right">
                          {item.finalPrice.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="">
                    <td colSpan="9" className="text-right p-2 ">
                      <button
                        onClick={addRow}
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                      >
                        เพิ่มรายการ
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <table className="table-auto w-full border border-gray-200">
              <tbody>
                <tr className="bg-white font-bold">
                  <td className="p-2 text-center w-10"></td>
                  <td className="p-2 w-32"></td>
                  <td className="p-2 text-center w-20">
                    <div className="col-span-1 p-2 bg-gray-200 rounded-md ">
                      {totals.totalQty}
                    </div>
                  </td>
                  <td className="border p-2 text-center w-20">
                    <div className="col-span-1 p-2 bg-gray-200 rounded-md ">
                      {totals.totalWeight}
                    </div>
                  </td>
                  <td className="p-2 text-right w-32"></td>
                  <td className="p-2 text-center w-20"></td>
                  <td className="p-2 text-right w-32">
                    <div className="col-span-1 p-2 bg-gray-200 rounded-md ">
                      {totals.totalBeforeDiscount.toFixed(2)}
                    </div>
                  </td>
                  <td className="border p-2 text-right w-20"></td>
                  <td className="p-2 text-right w-32">
                    <div className="col-span-1 p-2 bg-gray-200 rounded-md ">
                      {totals.totalNetPrice.toFixed(2)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <textarea
              className="w-full bg-white border border-gray-300 p-2 rounded-md mt-5"
              rows="5"
              placeholder="Remark"
              value={remark}
              onChange={(e) => handleRemarkChange(e.target.value)}
            ></textarea>
          </div>

          {/* total */}
          <div className="total w-1/3 bg-white text-black border-t border-gray-300 p-5 flex flex-col">
            <p className="text-green-900 font-bold mb-4">สรุป</p>
            <div className="mb-4 mx-5 flex flex-col gap-3">
              <div className="flex justify-between">
                <span>ราคาสุทธิ</span>
                <div className=" flex flex-row">
                  <span className="border border-gray-300 w-24 text-right mx-2 px-1">
                    {totals.totalNetPrice.toFixed(2)}
                  </span>
                  THB
                </div>
              </div>
              <div className="flex justify-between">
                <span>ส่วนลดท้ายบิล</span>
                <div className=" flex flex-row">
                  <span>
                    <input
                      type="int"
                      className="border border-gray-300 w-24 text-right mx-2 px-1"
                      value={billDiscount}
                      onChange={(e) => handleBillDiscountChange(e.target.value)}
                    />
                  </span>
                  THB
                </div>
              </div>
              <div className="flex justify-between">
                <span>ราคาหลังหักส่วนลด</span>
                <div className=" flex flex-row">
                  <span className="border border-gray-300 w-24 text-right mx-2 px-1">
                    {totals.totalAfterBillDiscount.toFixed(2)}
                  </span>
                  THB
                </div>
              </div>
              <div className="flex justify-between">
                <span>Vat (7%)</span>
                <div className=" flex flex-row">
                  <span className="border border-gray-300 w-24 text-right mx-2 px-1">
                    {totals.totalVat.toFixed(2)}
                  </span>
                  THB
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center font-bold text-xl m-5 p-5 bg-gray-200 h-20">
              <span>Grand Total:</span>
              <span>{totals.totalGrand.toFixed(2)} THB</span>
            </div>
            <textarea
              className="w-full bg-white border border-gray-300 p-2 rounded-md mt-5"
              rows="4"
              placeholder="Note"
              value={note}
              onChange={(e) => handleNoteChange(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-4 p-5 border border-t">
          <button
            onClick={handleCancel}
            className="border border-gray-300 text-black px-4 py-2 rounded font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="border border-gray-300 text-black px-4 py-2 rounded font-bold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
