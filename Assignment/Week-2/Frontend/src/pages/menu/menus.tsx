import Layout from "../../components/layout";
import cafeBackgroundImage from "../../assets/images/bg-menu-coffe.jpg";
import useSWR from "swr";
import { Coffee } from "../../lib/models";
import Loading from "../../components/loading";
import { Alert, Button } from "@mantine/core";
import { IconAlertTriangleFilled, IconPlus } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function BooksPage() {
  const { data: coffees, error } = useSWR<Coffee[]>("/coffees");

  return (
    <>
      <Layout>
        <section
          className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
          style={{
            backgroundImage: `url(${cafeBackgroundImage})`,
          }}
        >
          <h1 className="text-5xl mb-2">เมนู</h1>
          <h2>รายการเมนูทั้งหมด</h2>
        </section>

        <section className="container mx-auto py-8">
          <div className="flex justify-between">
            <h1>รายการเมนู</h1>

            <Button
              component={Link}
              leftSection={<IconPlus />}
              to="/coffees/create"
              size="xs"
              variant="primary"
              className="flex items-center space-x-2"
            >
              เพิ่มเมนู
            </Button>
          </div>

          {!coffees && !error && <Loading />}
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
            {coffees?.map((coffee) => (
              <div className="border border-solid border-neutral-200" key={coffee.id}>
                <img
                  src="https://placehold.co/150x200"
                  alt={coffee.name}
                  className="w-full object-cover aspect-[3/4]"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold line-clamp-2">{coffee.name}</h2>
                  <p className="text-xs text-neutral-500">ราคา {coffee.price} บาท</p>
                </div>

                <div className="flex justify-end px-4 pb-2">
                  <Button component={Link} to={`/coffees/${coffee.id}`} size="xs" variant="default">
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
