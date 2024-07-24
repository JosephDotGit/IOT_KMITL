import Layout from "../../components/layout";
import cafeBackgroundImage from "../../assets/images/staff.jpg";
import useSWR from "swr";
import { Order } from "../../lib/models";
import Loading from "../../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function BooksPage() {
  const { data: orders, error } = useSWR<Order[]>("/orders");

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">สั่งเมนู</h1>
          <h2>รายการเมนูที่ถูกสั่งทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>เมนูที่ถูกสั่ง</h1>

            <Button
              component={Link}
              leftSection={<IconPlus />}
              to="/orders/create"
              size="xs"
              variant="primary"
              className="flex items-center space-x-2"
            >
              สั่งเมนู
            </Button>
          </div>

          {!orders && !error && <Loading />}
          {error && (
            <Alert
              color="red"
              title="เกิดข้อผิดพลาดในการอ่านข้อมูล"
              icon={<IconAlertTriangleFilled />}
            >
              {error.message}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orders?.map((order) => (
              <div className="border border-solid border-neutral-200" key={order.id}>
                <img
                  src="https://placehold.co/150x200"
                  alt={order.status}
                  className="w-full object-cover aspect-[3/4]"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">Order #{order.id} {order.coffee_name}</h2>
                  <p className="text-xs text-neutral-500">จำนวน: {order.quantity}</p>
                  <p className="text-xs text-neutral-500">สถานะ: {order.status}</p>
                </div>

                <div className="flex justify-end px-4 pb-2">
                  <Button component={Link} to={`/orders/${order.id}`} size="xs" variant="default">
                    ดูรายละเอียด
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
