// 完成基本版面，將 membership_basic_setting 轉走

// 想加入每次 fetch database previous setting


// // src/app/dashboard/discount_code_list/point_setting/page.tsx

// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import {
//   Button,
//   Form,
//   Input,
//   Select,
//   Typography,
//   InputNumber,
//   Checkbox,
//   Divider,
//   message
// } from 'antd';
// import type { CheckboxChangeEvent } from 'antd/es/checkbox';
// import { purple } from '@ant-design/colors';

// const { Title } = Typography;



// interface Form2Values {
//   purchase_count: number; 
//   purchase_count_point_awarded: number;
//   purchase_amount: number;
//   purchase_amount_point_awarded: number;
//   points_per_referral: number

// }


// // Define the input fields for each option
// const optionInputFields: Record<
//   string,
//   Array<{
//     label: string;
//     name: string;
//     type: 'number' | 'text';
//     required: boolean;
//     message: string;
//     placeholder?: string;
//   }>
// > = {
//   '購買次數': [
//     {
//       label: '購買次數',
//       name: 'purchase_count',
//       type: 'number',
//       required: true,
//       message: '請輸入購買次數',
//       placeholder: '請輸入購買次數 (整數)',
//     },
//     {
//       label: '獲得的積分',
//       name: 'purchase_count_point_awarded',
//       type: 'number',
//       required: true,
//       message: '請輸入獲得的積分',
//       placeholder: '請輸入獲得的積分 (整數)',
//     },
//   ],
//   '購買金額': [
//     {
//       label: '購買金額',
//       name: 'purchase_amount',
//       type: 'number',
//       required: true,
//       message: '請輸入購買金額',
//       placeholder: '請輸入購買金額 (整數)',
//     },
//     {
//       label: '獲得的積分',
//       name: 'purchase_amount_point_awarded',
//       type: 'number',
//       required: true,
//       message: '請輸入獲得的積分',
//       placeholder: '請輸入獲得的積分 (整數)',
//     },
//   ],
//   '會員推薦': [
//     {
//       label: '每次推薦的積分',
//       name: 'points_per_referral',
//       type: 'number',
//       required: true,
//       message: '請輸入每次推薦的積分',
//       placeholder: '請輸入每次推薦的積分 (整數)',
//     },
//   ],
// };

// const GetMemberSettingPage: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [form2] = Form.useForm();




  
//   const onFinishForm2 = async (values: Form2Values) => {
//     // Include admin_setting_id in the data
//     const dataToSend = {
//       purchase_count: values.purchase_count,
//       purchase_count_point_awarded: values.purchase_count_point_awarded,
//       purchase_amount: values.purchase_amount,
//       purchase_amount_point_awarded: values.purchase_amount_point_awarded,
//       points_per_referral: values.points_per_referral,
//     };
  
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin_setting/post_member_point_rule`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(dataToSend),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Server error! status: ${response.status}`);
//       }
  
//       const responseData = await response.json();
//       console.log('Server Response:', responseData);
//       // Optionally, display a success message or perform other actions
//       message.success('Settings updated successfully!');
//     } catch (error: any) {
//       console.error('Error submitting form:', error);
//       // Optionally, display an error message
//       message.error(`Failed to update settings: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
    
//     const fetchPointSettings = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/point_setting/get_member_point_rule`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//         });
  
//         if (!response.ok) {
//           throw new Error(`Failed to fetch point settings: ${response.statusText}`);
//         }
  
//         const data: PointSettings = await response.json();
  
//         // Update the form fields
//         form2.setFieldsValue(data);
  
//         // Update checkedOptions based on the data
//         const newCheckedOptions: Record<string, boolean> = {
//           '購買次數': data.purchase_count != null && data.purchase_count_point_awarded != null,
//           '購買金額': data.purchase_amount != null && data.purchase_amount_point_awarded != null,
//           '會員推薦': data.points_per_referral != null,
//         };
  
//         setCheckedOptions(newCheckedOptions);
//       } catch (error) {
//         console.error('Error fetching point settings:', error);
//         // Optionally set an error state and display an error message
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchPointSettings();
//   }, [form2]);



//   // Checkbox States
//   const initialCheckedOptions = {
//     '購買次數': false,
//     '購買金額': false,
//     '會員推薦': false,
//   };
  
//   const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(initialCheckedOptions);

//   const plainOptions = Object.keys(checkedOptions);

//   // Handle individual checkbox change
//   const handleOptionChange = (option: string, checked: boolean) => {
//     setCheckedOptions((prevState) => ({
//       ...prevState,
//       [option]: checked,
//     }));
//   };

//   // Check if all checkboxes are checked
//   const allChecked = Object.values(checkedOptions).every((value) => value);

//   // Check if some (but not all) checkboxes are checked
//   const isIndeterminate =
//     Object.values(checkedOptions).some((value) => value) && !allChecked;

//   // Handle "Check All" change
//   const handleCheckAllChange = (e: CheckboxChangeEvent) => {
//     const checked = e.target.checked;
//     const newCheckedOptions = plainOptions.reduce((options, option) => {
//       options[option] = checked;
//       return options;
//     }, {} as Record<string, boolean>);
//     setCheckedOptions(newCheckedOptions);
//   };

//   return (
//     <>
//       {/* Second Form for 獲取積分規則 */}
//       <Form
//         form={form2}
//         onFinish={onFinishForm2}
//         layout="horizontal"
//         labelCol={{ span: 6 }}
//         wrapperCol={{ span: 14 }}
//         style={{ marginTop: '2rem' }}
//       >
//         <div style={{ display: 'flex', justifyContent: 'center' }}>
//           <Title level={2} style={{ backgroundColor: purple[1], padding: '1rem' }}>
//             獲取積分規則
//           </Title>
//         </div>

//         {/* "Check All" Checkbox */}
//         <Form.Item label="全部選擇" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
//           <Checkbox
//             indeterminate={isIndeterminate}
//             onChange={handleCheckAllChange}
//             checked={allChecked}
//           >
//             全部選擇
//           </Checkbox>
//         </Form.Item>

//         <Divider />

//         {/* Render Individual Checkboxes with Conditional Inputs */}
//         {plainOptions.map((option) => (
//           <div key={option}>
//             <Form.Item
//               label={option}
//               labelCol={{ span: 6 }}
//               wrapperCol={{ span: 14 }}
//             >
//               <Checkbox
//                 checked={checkedOptions[option]}
//                 onChange={(e) => handleOptionChange(option, e.target.checked)}
//               >
//                 {/* {option} */}
//               </Checkbox>
//             </Form.Item>

//             {/* Conditionally Render Input Fields */}
//             {checkedOptions[option] &&
//               optionInputFields[option]?.map((field) => (
//                 <Form.Item
//                   key={field.name}
//                   label={field.label}
//                   name={field.name}
//                   rules={[{ required: field.required, message: field.message }]}
//                   labelCol={{ span: 6 }}
//                   wrapperCol={{ span: 14 }}
//                 >
//                   {field.type === 'number' ? (
//                     <InputNumber
//                       style={{ width: '100%' }}
//                       placeholder={field.placeholder || ''}
//                     />
//                   ) : (
//                     <Input placeholder={field.placeholder || ''} />
//                   )}
//                 </Form.Item>
//               ))}
//           </div>
//         ))}

//         <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>
//     </>
//   );
// };

// export default GetMemberSettingPage;