// 完成：加入了開啟不同規則，打開後會 render 相應問題，但一式一樣

// 想將 render 的問題按規則不同

// src/app/dashboard/app_setting/point_setting/page.tsx

// 'use client';

// import React, { useState } from 'react';
// import {
//     Button,
//     Form,
//     Input,
//     Select,
//     Typography,
//     InputNumber,
//     Checkbox,
//     Divider,
// } from 'antd';
// import type { CheckboxChangeEvent } from 'antd/es/checkbox';
// import { purple } from '@ant-design/colors';

// const { Title } = Typography;

// const membership_period = [
//     { value: '1', label: '1' },
//     { value: '2', label: '2' },
//     { value: '3', label: '3' },
//     { value: '4', label: '4' },
//     { value: '5', label: '5' },
// ];

// const membership_extend_method = [
//     { value: '1', label: '購物滿一定金額，開啟續會按鈕。' },
//     { value: '2', label: '只需詢問顧客意願，無條件續會。' },
// ];

// const membership_end_result = [
//     { value: '1', label: '會員期結束，會員擁有的積分及禮遇會失效' },
//     { value: '2', label: '會員期結束，會員擁有的積分及禮遇不會失效，續會後可繼續使用。' },
// ];

// const GetMemberSettingPage: React.FC = () => {
//     const [form1] = Form.useForm();
//     const [form2] = Form.useForm();

//     const onFinishForm1 = (values: any) => {
//         console.log('Form1 Values:', values);
//         // Handle submission for the first form here
//     };

//     const onFinishForm2 = (values: any) => {
//         console.log('Form2 Values:', values);
//         // Handle submission for the second form here
//     };

//     // Checkbox States
//     const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>({
//         '購買次數': false,
//         '購買金額': false,
//         '會員推薦': false,
//     });

//     const plainOptions = Object.keys(checkedOptions);

//     // Handle individual checkbox change
//     const handleOptionChange = (option: string, checked: boolean) => {
//         setCheckedOptions((prevState) => ({
//             ...prevState,
//             [option]: checked,
//         }));
//     };

//     // Check if all checkboxes are checked
//     const allChecked = Object.values(checkedOptions).every((value) => value);

//     // Check if some (but not all) checkboxes are checked
//     const isIndeterminate =
//         Object.values(checkedOptions).some((value) => value) && !allChecked;

//     // Handle "Check All" change
//     const handleCheckAllChange = (e: CheckboxChangeEvent) => {
//         const checked = e.target.checked;
//         const newCheckedOptions = plainOptions.reduce((options, option) => {
//             options[option] = checked;
//             return options;
//         }, {} as Record<string, boolean>);
//         setCheckedOptions(newCheckedOptions);
//     };

//     return (
//         <>
//             <Form
//                 form={form1}
//                 onFinish={onFinishForm1}
//                 layout="horizontal"
//                 labelCol={{ span: 6 }}
//                 wrapperCol={{ span: 14 }}
//             >
//                 <div style={{ display: 'flex', justifyContent: 'center' }}>
//                     <Title level={2} style={{ backgroundColor: purple[1], padding: '1rem' }}>
//                         會員基本設定
//                     </Title>
//                 </div>

//                 <Form.Item
//                     label="會員有效期"
//                     name="membership_period"
//                     rules={[{ required: true, message: '請選擇會員有效期' }]}
//                 >
//                     <Select
//                         defaultValue="1"
//                         style={{ width: 70 }}
//                         allowClear
//                         options={membership_period}
//                         placeholder="select it"
//                     />{' '}
//                     年
//                 </Form.Item>

//                 <Form.Item
//                     label="續會方式"
//                     name="membership_extend_method"
//                     rules={[{ required: true, message: '請選擇續會方式' }]}
//                 >
//                     <Select
//                         defaultValue="2"
//                         style={{ width: 600 }}
//                         allowClear
//                         options={membership_extend_method}
//                         placeholder="select it"
//                     />
//                 </Form.Item>

//                 <Form.Item
//                     label="會員期結束的處理"
//                     name="membership_end_result"
//                     rules={[{ required: true, message: '請選擇會員期結束的處理' }]}
//                 >
//                     <Select
//                         defaultValue="1"
//                         style={{ width: 600 }}
//                         allowClear
//                         options={membership_end_result}
//                         placeholder="select it"
//                     />
//                 </Form.Item>

//                 <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//                     <Button type="primary" htmlType="submit">
//                         Submit
//                     </Button>
//                 </Form.Item>
//             </Form>

//             <Divider />

//             {/* Second Form for 獲取積分規則 */}
//             <Form
//                 form={form2}
//                 onFinish={onFinishForm2}
//                 layout="horizontal"
//                 labelCol={{ span: 6 }}
//                 wrapperCol={{ span: 14 }}
//                 style={{ marginTop: '2rem' }}
//             >
//                 <div style={{ display: 'flex', justifyContent: 'center' }}>
//                     <Title level={2} style={{ backgroundColor: purple[1], padding: '1rem' }}>
//                         獲取積分規則
//                     </Title>
//                 </div>

//                 {/* "Check All" Checkbox */}
//                 <Form.Item label="全部選擇" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
//                     <Checkbox
//                         indeterminate={isIndeterminate}
//                         onChange={handleCheckAllChange}
//                         checked={allChecked}
//                     >
//                         全部選擇
//                     </Checkbox>
//                 </Form.Item>

//                 <Divider />

//                 {/* Render Individual Checkboxes with Conditional Inputs */}
//                 {plainOptions.map((option) => (
//                     <div key={option}>
//                         <Form.Item
//                             label={option}
//                             labelCol={{ span: 6 }}
//                             wrapperCol={{ span: 14 }}
//                         >
//                             <Checkbox
//                                 checked={checkedOptions[option]}
//                                 onChange={(e) => handleOptionChange(option, e.target.checked)}
//                             >
//                                 {/* {option} */}
//                             </Checkbox>
//                         </Form.Item>

//                         {/* Conditionally Render Input Fields */}
//                         {checkedOptions[option] && (
//                             <>
//                                 <Form.Item
//                                     label={`${option} - 輸入欄位1`}
//                                     name={`${option}_field1`}
//                                     rules={[{ required: true, message: '請輸入內容' }]}
//                                     labelCol={{ span: 6 }}
//                                     wrapperCol={{ span: 14 }}
//                                 >
//                                     <Input placeholder={`請輸入${option}的內容1`} />
//                                 </Form.Item>
//                                 <Form.Item
//                                     label={`${option} - 輸入欄位2`}
//                                     name={`${option}_field2`}
//                                     rules={[{ required: true, message: '請輸入內容' }]}
//                                     labelCol={{ span: 6 }}
//                                     wrapperCol={{ span: 14 }}
//                                 >
//                                     <Input placeholder={`請輸入${option}的內容2`} />
//                                 </Form.Item>
//                             </>
//                         )}
//                     </div>
//                 ))}

//                 <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//                     <Button type="primary" htmlType="submit">
//                         Submit
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </>
//     );
// };

// export default GetMemberSettingPage;