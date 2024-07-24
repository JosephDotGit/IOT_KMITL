import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout";
import { Button, Container, Divider, NumberInput, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { Coffee, Order } from "../../lib/models";
import useSWR from "swr";

export default function OrderCreatePage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: coffees } = useSWR<Coffee[]>('/coffees');

  const orderCreateForm = useForm({
    initialValues: {
      coffee_id: "",
      quantity: 1,
      notes: "",
    },

    validate: {
      coffee_id: (value) => {
        if (!value) return "กรุณาเลือกกาแฟ";
        return null;
      },
      quantity: (value) => {
        if (!value) return "กรุณาระบุจำนวน";
        if (isNaN(Number(value))) return "จำนวนต้องเป็นตัวเลขเท่านั้น";
        if (Number(value) <= 0) return "จำนวนต้องมากกว่า 0";
        return null;
      },
      notes: (value) => {
        if (value && value.length > 500) return "หมายเหตุต้องมีความยาวไม่เกิน 500 ตัวอักษร";
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof orderCreateForm.values) => {
    try {
      setIsProcessing(true);
      const response = await axios.post<Order>(`orders`, values);
      notifications.show({
        title: "สั่งกาแฟสำเร็จ",
        message: "คำสั่งซื้อของคุณได้รับการบันทึกเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
        } else if (error.response?.status || 500 >= 500) {
          notifications.show({
            title: "เกิดข้อผิดพลาดบางอย่าง",
            message: "กรุณาลองใหม่อีกครั้ง",
            color: "red",
          });
        }
      } else {
        notifications.show({
          title: "เกิดข้อผิดพลาดบางอย่าง",
          message: "กรุณาลองใหม่อีกครั้ง หรือดูที่ Console สำหรับข้อมูลเพิ่มเติม",
          color: "red",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <Container className="mt-8">
        <h1 className="text-xl">สั่งกาแฟ</h1>

        <form onSubmit={orderCreateForm.onSubmit(handleSubmit)} className="space-y-8">
          <Select
            label="เลือกกาแฟ"
            placeholder="เลือกกาแฟที่ต้องการ"
            data={coffees?.map(coffee => ({ value: coffee.id.toString(), label: `${coffee.name} - ฿${coffee.price}` })) || []}
            {...orderCreateForm.getInputProps("coffee_id")}
          />

          <NumberInput
            label="จำนวน"
            placeholder="จำนวน"
            {...orderCreateForm.getInputProps("quantity")}
            min={1}
          />

          <Textarea
            label="หมายเหตุ"
            placeholder="หมายเหตุหรือคำแนะนำพิเศษ (ถ้ามี)"
            {...orderCreateForm.getInputProps("notes")}
          />

          <Divider />

          <Button type="submit" loading={isProcessing}>
            สั่งซื้อ
          </Button>
        </form>
      </Container>
    </Layout>
  );
}
