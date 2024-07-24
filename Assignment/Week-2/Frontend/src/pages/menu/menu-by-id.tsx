import { Alert, Button, Container, Divider } from "@mantine/core";
import Layout from "../../components/layout";
import { Link, useParams } from "react-router-dom";
import { Coffee } from "../../lib/models";
import useSWR from "swr";
import Loading from "../../components/loading";
import { IconAlertTriangleFilled, IconEdit } from "@tabler/icons-react";

export default function CoffeeByIdPage() {
  const { coffeeId } = useParams();

  const { data: coffee, isLoading, error } = useSWR<Coffee>(`/coffees/${coffeeId}`);

  return (
    <>
      <Layout>
        <Container className="mt-4">
          {/* You can use isLoading instead of !book */}
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
              <h1>{coffee.name}</h1>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <img
                  src="https://placehold.co/150x200"
                  alt={coffee.name}
                  className="w-full object-cover aspect-[3/4]"
                />
                <div className="col-span-2 px-4 space-y-2 py-4">
                  <h3>รายละเอียดกาเเฟ</h3>
                  <p className="indent-4">
                    {coffee.description}
                  </p>

                  <h3>ราคา</h3>
                  <p className="indent-4">
                    {coffee.price}
                  </p>

                </div>
              </div>

              <Divider className="mt-4" />

              <Button
                color="blue"
                size="xs"
                component={Link}
                to={`/coffees/${coffee.id}/edit`}
                className="mt-4"
                leftSection={<IconEdit />}
              >
                แก้ไขข้อมูลกาเเฟ
              </Button>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
