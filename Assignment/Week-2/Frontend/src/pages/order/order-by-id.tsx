import { Alert, Button, Container, Divider } from "@mantine/core";
import Layout from "../../components/layout";
import { Link, useParams } from "react-router-dom";
import { Order } from "../../lib/models";
import useSWR from "swr";
import Loading from "../../components/loading";
import { IconAlertTriangleFilled, IconEdit } from "@tabler/icons-react";

export default function OrderByIdPage() {
  const { orderId } = useParams();
  const { data: order, isLoading, error } = useSWR<Order>(`/orders/${orderId}`);

  return (
    <Layout>
      <Container className="mt-4">
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

        {order && (
          <>
            <h1 className="text-2xl font-bold mb-4">{order.coffee_name}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <img
                src="https://placehold.co/300x400"
                alt={order.coffee_name}
                className="w-full object-cover aspect-[3/4] rounded-lg"
              />

              <div className="col-span-2 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">รหัสออเดอร์</h3>
                  <p>{order.id}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">รหัสเมนูกาแฟ</h3>
                  <p>{order.coffee_id}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">รายละเอียดการสั่งเมนู</h3>
                  <p>
                    จำนวน: {order.quantity}<br />
                    สถานะ: {order.status}<br />
                    หมายเหตุ: {order.notes || "ไม่มี"}
                  </p>
                </div>


              </div>
            </div>

            <Divider className="my-6" />

            <Button
              color="blue"
              size="sm"
              component={Link}
              to={`/orders/${orderId}/edit`}
              leftSection={<IconEdit size={16} />}
            >
              แก้ไขข้อมูลการสั่ง
            </Button>
          </>
        )}
      </Container>
    </Layout>
  );
}
