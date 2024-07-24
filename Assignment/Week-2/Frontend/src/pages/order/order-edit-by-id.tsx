import useSWR from "swr";
import { Order, Coffee } from "../../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import { Alert, Button, Container, Divider, NumberInput, TextInput, Select } from "@mantine/core";
import Loading from "../../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export default function OrderEditById() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: order, isLoading, error } = useSWR<Order>(orderId ? `/orders/${orderId}` : null);
  const { data: coffees } = useSWR<Coffee[]>('/coffees'); // Fetch all available coffees

  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  const orderEditForm = useForm({
    initialValues: {
      coffee_id: "",
      quantity: 1,
      status: "pending",
      notes: "",
    },
    validate: {
      coffee_id: (value) => (!value ? "กรุณาเลือกกาแฟ" : null),
      quantity: (value) => (value <= 0 ? "จำนวนต้องมากกว่า 0" : null),
      status: (value) => (!value ? "กรุณาระบุสถานะ" : null),
      notes: (value) => (value && value.length > 500 ? "หมายเหตุต้องมีความยาวไม่เกิน 500 ตัวอักษร" : null),
    },
  });

  const handleSubmit = async (values: typeof orderEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/orders/${orderId}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลออเดอร์สำเร็จ",
        message: "ข้อมูลออเดอร์ได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/orders/${orderId}`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/orders/${orderId}`);
      notifications.show({
        title: "ลบออเดอร์สำเร็จ",
        message: "ลบออเดอร์นี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/orders");
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      switch (status) {
        case 404:
          notifications.show({
            title: "ไม่พบข้อมูลออเดอร์",
            message: "ไม่พบข้อมูลออเดอร์ที่ต้องการแก้ไข",
            color: "red",
          });
          break;
        case 422:
          notifications.show({
            title: "ข้อมูลไม่ถูกต้อง",
            message: "กรุณาตรวจสอบข้อมูลที่กรอกใหม่อีกครั้ง",
            color: "red",
          });
          break;
        default:
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
      console.error("Unexpected error:", error);
    }
  };

  useEffect(() => {
    if (!isSetInitialValues && order) {
      // Convert coffee_id to string if necessary
      orderEditForm.setInitialValues({
        ...order,
        coffee_id: order.coffee_id.toString(),
      });
      orderEditForm.setValues({
        ...order,
        coffee_id: order.coffee_id.toString(),
      });
      setIsSetInitialValues(true);
    }
  }, [order, orderEditForm, isSetInitialValues]);

  return (
    <Layout>
      <Container className="mt-8">
        <h1 className="text-xl">แก้ไขข้อมูลออเดอร์</h1>

        {isLoading && !error && <Loading />}
        {error && (
          <Alert color="red" title="เกิดข้อผิดพลาดในการอ่านข้อมูล" icon={<IconAlertTriangleFilled />}>
            {error.message}
          </Alert>
        )}

        {!!order && (
          <form onSubmit={orderEditForm.onSubmit(handleSubmit)} className="space-y-8">
            <Select
              label="ชื่อกาแฟ"
              placeholder="เลือกกาแฟ"
              data={coffees?.map(coffee => ({ value: coffee.id.toString(), label: coffee.name })) || []}
              {...orderEditForm.getInputProps("coffee_id")}
            />

            <NumberInput
              label="จำนวน"
              placeholder="จำนวน"
              min={1}
              {...orderEditForm.getInputProps("quantity")}
            />

            <TextInput
              label="สถานะ(ex. pending, completed, cancelled)"
              placeholder="สถานะ"
              {...orderEditForm.getInputProps("status")}
            />

            <TextInput
              label="หมายเหตุ"
              placeholder="หมายเหตุ"
              {...orderEditForm.getInputProps("notes")}
            />

            <Divider />

            <div className="flex justify-between">
              <Button
                color="red"
                leftSection={<IconTrash />}
                size="xs"
                onClick={() => {
                  modals.openConfirmModal({
                    title: "คุณต้องการลบออเดอร์นี้ใช่หรือไม่",
                    children: <span className="text-xs">เมื่อคุณดำเนินการลบออเดอร์นี้แล้ว จะไม่สามารถย้อนกลับได้</span>,
                    labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                    onConfirm: handleDelete,
                    confirmProps: {
                      color: "red",
                    },
                  });
                }}
              >
                ลบออเดอร์นี้
              </Button>

              <Button type="submit" loading={isLoading || isProcessing}>
                บันทึกข้อมูล
              </Button>
            </div>
          </form>
        )}
      </Container>
    </Layout>
  );
}
