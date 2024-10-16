// 想將 form data structure 成 array 放回 frontend

// src/app/dashboard/app_setting/member_tier/page.tsx

// 'use client'

// import React, { useState } from 'react';
// import {
//   Button,
//   Cascader,
//   DatePicker,
//   Form,
//   Input,
//   InputNumber,
//   Mentions,
//   Select,
//   TreeSelect,
//   Segmented,
// } from 'antd';
// import { Typography } from 'antd';
// const { Title } = Typography;
// import type { FormProps } from 'antd';
// import { blue, purple } from '@ant-design/colors';
// import { message } from 'antd'; // Ant Design's message component for notifications


// // Define the structure of form values
// interface MemberTierFormValues {
//   // First Layer
//   first_layer_name: string;
//   first_require_point: number;
//   first_extend_membership_point: number;

//   // Second Layer
//   second_layer_name: string;
//   second_require_point: number;
//   second_extend_membership_point: number;
//   second_point_multiplier: number;

//   // Third Layer
//   third_layer_name: string;
//   third_require_point: number;
//   third_extend_membership_point: number;
//   third_point_multiplier: number;
// }

// // const { RangePicker } = DatePicker;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 6 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 10 },
//   },
// };

// const MemberTier: React.FC = function MemberTier() {
//   // const [componentVariant, setComponentVariant] = useState<FormProps['variant']>('filled');

//   // const onFormVariantChange = ({ variant }: { variant: FormProps['variant'] }) => {
//   //   setComponentVariant(variant);
//   // };

//   // Inside your MemberTier component

//   const onFinish = async (values: MemberTierFormValues) => {
//     console.log('Form Submitted Successfully:', values);

//     try {
//       const response = await fetch('http://localhost:3000/admin/membership_tier', { // Replace with your actual endpoint
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(values),
//       });
//       console.log(response.body)

//       if (!response.ok) {
//         throw new Error(`Server error! status: ${response.status}`);
//       }

//       const responseData = await response.json();
//       console.log('Server Response:', responseData);

//       message.success('Membership tiers updated successfully!');
//       // Optionally, reset the form or redirect the user
//     } catch (error: any) {
//       console.error('Error submitting form:', error);
//       message.error(`Failed to update membership tiers: ${error.message}`);
//     }
//   };


//   const onFinishFailed = (errorInfo: any) => {
//     console.log('Form Submission Failed:', errorInfo);
//     // Optionally, you can display a notification or message to the user
//   };



//   return (

//     <Form
//       {...formItemLayout}
//       // onValuesChange={onFormVariantChange}
//       // variant={componentVariant}
//       // style={{ maxWidth: 600 }}
//       // initialValues={{ variant: componentVariant }}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}

//     >
//       {/* <h1 style={{ backgroundColor: purple[1] }}>會員層級設定 </h1> */}
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <Title level={2} style={{ backgroundColor: purple[1], padding: '1rem' }}>
//           會員層級設定
//         </Title>
//       </div>
//       {/* <Form.Item label="Form variant" name="variant">
//         <Segmented options={['outlined', 'filled', 'borderless']} />
//       </Form.Item> */}

//       <h1>首層會員層級設定</h1>
//       <Form.Item label="首層會員名稱" name="first_layer_name" rules={[{ required: true, message: '請輸入首層會員名稱' }]}>
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="所需積分"
//         name="first_require_point"
//         rules={[{ required: true, message: '請輸入成為此層級會員所需積分' }]}
//       >
//         <InputNumber style={{ width: '100%' }} />
//       </Form.Item>

//       <Form.Item
//         label="續會一年所需積分"
//         name="first_extend_membership_point"
//         rules={[{ required: true, message: '請輸入續會所需積分' }]}
//       >
//         <InputNumber style={{ width: '100%' }} />
//       </Form.Item>


//       <h1>第二層會員層級設定</h1>
//       <Form.Item label="第二層會員名稱" name="second_layer_name" rules={[{ required: true, message: '請輸入第二層會員名稱' }]}>
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="所需積分"
//         name="second_require_point"
//         rules={[{ required: true, message: '請輸入成為此層級會員所需積分' }]}
//       >
//         <InputNumber style={{ width: '100%' }} />
//       </Form.Item>

//       <Form.Item
//         label="續會一年所需積分"
//         name="second_extend_membership_point"
//         rules={[{ required: true, message: '請輸入續會所需積分' }]}
//       >
//         <InputNumber style={{ width: '100%' }} />
//       </Form.Item>

//       <Form.Item
//         label="積分獲得倍數（對比首層會員）"
//         name="second_point_multiplier"
//         rules={[{ required: true, message: '請輸入積分獲得倍數' }]}
//       >
//         <InputNumber style={{ width: '100%' }} />
//       </Form.Item>

//       <h1>第三層會員層級設定</h1>
//       <Form.Item label="第三層會員名稱" name="third_layer_name" rules={[{ required: true, message: '請輸入第三層會員名稱' }]}>
//         <Input />
//       </Form.Item>

//       <Form.Item
//         label="所需積分"
//         name="third_require_point"
//         rules={[{ required: true, message: '請輸入成為此層級會員所需積分' }]}
//       >
//         <InputNumber style={{ width: '100%' }} />
//       </Form.Item>

//       <Form.Item
//         label="續會一年所需積分"
//         name="third_extend_membership_point"
//         rules={[{ required: true, message: '請輸入續會所需積分' }]}
//       >
//         <InputNumber style={{ width: '100%' }} />
//       </Form.Item>


//       <Form.Item
//         label="積分獲得倍數（對比首層會員）"
//         name="third_point_multiplier"
//         rules={[{ required: true, message: '請輸入積分獲得倍數' }]}
//       >
//         <InputNumber style={{ width: '100%' }} />
//       </Form.Item>


//       <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// }

// export default MemberTier;