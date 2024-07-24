import useSWR from "swr";
import { Book } from "../../lib/models";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import { TagsInput, Alert, Button, Checkbox, Container, Divider, NumberInput, TextInput } from "@mantine/core";
import Loading from "../../components/loading";
import { IconAlertTriangleFilled, IconTrash } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

interface BookFormValues {
  title: string;
  author: string;
  details: string;
  synopsis: string;
  category: string[];
  year: number;
  is_published: boolean;
}

export default function BookEditById() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: book, isLoading, error } = useSWR<Book>(`/books/${bookId}`);
  const [isSetInitialValues, setIsSetInitialValues] = useState(false);

  const bookEditForm = useForm<BookFormValues>({
    initialValues: {
      title: "",
      author: "",
      details: "",
      synopsis: "",
      category: [],
      year: 2024,
      is_published: false,
    },

    validate: {
      title: isNotEmpty("กรุณาระบุชื่อหนังสือ"),
      author: isNotEmpty("กรุณาระบุชื่อผู้แต่ง"),
      year: isNotEmpty("กรุณาระบุปีที่พิมพ์หนังสือ"),
    },
  });

  const handleSubmit = async (values: BookFormValues) => {
    try {
      setIsProcessing(true);
      await axios.patch(`/books/${bookId}`, {
        ...values,
        category: values.category.join(", ") // Convert array to comma-separated string
      });
      notifications.show({
        title: "แก้ไขข้อมูลหนังสือสำเร็จ",
        message: "ข้อมูลหนังสือได้รับการแก้ไขเรียบร้อยแล้ว",
        color: "teal",
      });
      navigate(`/books/${bookId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 404:
            notifications.show({
              title: "ไม่พบข้อมูลหนังสือ",
              message: "ไม่พบข้อมูลหนังสือที่ต้องการแก้ไข",
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
      await axios.delete(`/books/${bookId}`);
      notifications.show({
        title: "ลบหนังสือสำเร็จ",
        message: "ลบหนังสือเล่มนี้ออกจากระบบเรียบร้อยแล้ว",
        color: "red",
      });
      navigate("/books");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          notifications.show({
            title: "ไม่พบข้อมูลหนังสือ",
            message: "ไม่พบข้อมูลหนังสือที่ต้องการลบ",
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
    if (!isSetInitialValues && book) {
      bookEditForm.setInitialValues({
        ...book,
        category: book.category ? book.category.split(",").map((cat) => cat.trim()) : [],
      });
      bookEditForm.setValues({
        ...book,
        category: book.category ? book.category.split(",").map((cat) => cat.trim()) : [],
      });
      setIsSetInitialValues(true);
    }
  }, [book, bookEditForm, isSetInitialValues]);

  return (
    <>
      <Layout>
        <Container className="mt-8">
          <h1 className="text-xl">แก้ไขข้อมูลหนังสือ</h1>

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

          {!!book && (
            <>
              <form onSubmit={bookEditForm.onSubmit(handleSubmit)} className="space-y-8">
                <TextInput
                  label="ชื่อหนังสือ"
                  placeholder="ชื่อหนังสือ"
                  {...bookEditForm.getInputProps("title")}
                />

                <TextInput
                  label="ชื่อผู้แต่ง"
                  placeholder="ชื่อผู้แต่ง"
                  {...bookEditForm.getInputProps("author")}
                />

                <TextInput
                  label="รายละเอียดหนังสือ"
                  placeholder="รายละเอียดหนังสือ"
                  {...bookEditForm.getInputProps("details")}
                />

                <TextInput
                  label="เรื่องย่อ"
                  placeholder="เรื่องย่อ"
                  {...bookEditForm.getInputProps("synopsis")}
                />

                <TagsInput
                  label="หมวดหมู่"
                  placeholder="พิมพ์หมวดหมู่และกด Enter"
                  {...bookEditForm.getInputProps("category")}
                />

                <NumberInput
                  label="ปีที่พิมพ์"
                  placeholder="ปีที่พิมพ์"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  {...bookEditForm.getInputProps("year")}
                />

                <Checkbox
                  label="เผยแพร่"
                  {...bookEditForm.getInputProps("is_published", {
                    type: "checkbox",
                  })}
                />

                <Divider />

                <div className="flex justify-between">
                  <Button
                    color="red"
                    leftSection={<IconTrash />}
                    size="xs"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่",
                        children: (
                          <span className="text-xs">
                            เมื่อคุณดำเนินการลบหนังสือเล่มนี้แล้ว จะไม่สามารถย้อนกลับได้
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
                    ลบหนังสือนี้
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
