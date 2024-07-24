import useSWR from "swr";
import { Coffee } from "../../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import { Alert, Button, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import Loading from "../../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

export default function BookEditById() {
  const { coffeeId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: coffee, isLoading, error } = useSWR<Coffee>(`/coffees/${coffeeId}`);
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  const coffeeEditForm = useForm({
    initialValues: {
      name: "",
      price: 0,
      description: "",
    },

    validate: {
      name: (value) => {
        if (typeof value !== 'string') return "ชื่อกาแฟต้องเป็นข้อความ";
        if (!value.trim()) return "กรุณาระบุชื่อกาแฟ";
        if (value.length < 2) return "ชื่อกาแฟต้องมีความยาวอย่างน้อย 2 ตัวอักษร";
        return null;

      },
      price: (value) => {
        if (!value) return "กรุณาระบุราคากาแฟ";
        if (isNaN(Number(value))) return "ราคาต้องเป็นตัวเลขเท่านั้น";
        if (Number(value) <= 0) return "ราคาต้องมากกว่า 0";
        return null;
      },
      description: (value) => {
        if (value && value.length > 500) return "รายละเอียดกาแฟต้องมีความยาวไม่เกิน 500 ตัวอักษร";
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof coffeeEditForm.values) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/coffees/${coffeeId}`, values);
      notifications.show({
        title: "แก้ไขข้อมูลกาเเฟสำเร็จ",
        message: "ข้อมูลกาเเฟได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/coffees/${coffeeId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 404:
            notifications.show({
              title: "ไม่พบข้อมูลกาเเฟ",
              message: "ไม่พบข้อมูลกาเเฟที่ต้องการแก้ไข",
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      await axios.delete(`/coffees/${coffeeId}`);
      notifications.show({
        title: "ลบกาเเฟสำเร็จ",
        message: "ลบกาเเฟเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/coffees");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลกาเเฟ",
            message: "ไม่พบข้อมูลกาเเฟที่ต้องการลบ",
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

  useEffect(() => {
    if (!isSetInitialValues && coffee) {
      coffeeEditForm.setInitialValues(coffee);
      coffeeEditForm.setValues(coffee);
      setIsSetInitialValues(true);
    }
  }, [coffee, coffeeEditForm, isSetInitialValues]);

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">แก้ไขข้อมูลกาเเฟ</h1>

          {isLoading && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          {!!coffee && (
            <>
              <form onSubmit={coffeeEditForm.onSubmit(handleSubmit)} className="space-y-8">
                <TextInput
                  label="ชื่อกาแฟ"
                  placeholder="ชื่อกาแฟ"
                  {...coffeeEditForm.getInputProps("name")}
                />

                <NumberInput
                  label="ราคา"
                  placeholder="ราคา"
                  min={0}
                  {...coffeeEditForm.getInputProps("price")}
                />

                <TextInput
                  label="รายละเอียดกาแฟ"
                  placeholder="รายละเอียดกาแฟ"
                  {...coffeeEditForm.getInputProps("description")}
                />



                <Divider />

                <div className="flex justify-between">
                  <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="xs"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบกาเเฟเล่มนี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำนเนินการลบกาเเฟเล่มนี้แล้ว จะไม่สามารถย้อนกลับได้
                          </span>
                        ),
                        labels: { confirm: "ลบ", cancel: "ยกเลิก" },
                        onConfirm: () => {
                          handleDelete();
                        },
                        confirmProps: {
                          color: "red",
                        },
                      });
                    }}
                  >
                    ลบกาเเฟนี้
                  </Button>

                  <Button type="submit" loading={isLoading || isProcessing}>
                    บันทึกข้อมูล
                  </Button>
                </div>
              </form>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
