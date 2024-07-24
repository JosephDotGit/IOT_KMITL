import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import coffeeImage from "../assets/images/coffee-1.jpg";

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">ยินดีต้อนรับสู่ IoT Library & Cafe</h1>
        <h2>ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน</h2>
      </section>

      <section className="container mx-auto py-8">
        <h1>เกี่ยวกับเรา</h1>

        <div className="grid grid-cols-3 gap-4">
          <p className="text-left col-span-2">
            IoT Library & Cafe เป็นร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน
            และเรียนรู้เรื่องใหม่ๆ ที่เกี่ยวกับเทคโนโลยี IoT โดยคาเฟ่ของเรานั้น ก่อตั้งขึ้นโดย
            ผศ.ดร. ปานวิทย์ ธุวะนุติ ซึ่งเป็นอาจารย์ในวิชา Internet of Things และนายกฤตณัฏฐ์
            ศิริพรนพคุณ เป็นผู้ช่วยสอนในหัวข้อ FastAPI และ React ในวิชานี้
          </p>

          <div>
            <img src={ajPanwitImage} alt="Panwit Tuwanut" className="h-full w-full object-cover" />
          </div>
        </div>
        <p className="text-right mt-8">
          ปัจจุบันคาเฟ่ และห้องสมุดของเรา อยู่ในช่วงการดูแลของ
          อยู่ในช่วงการดูแล นายจิรัฎฐวัฒน์ อัศวโกศลปภา 65070037 เป็นนักศึกษาไฟแรง
          จากวิชา Internet of Things โดยมีบริการสุดพิเศษที่ผสมผสานเทคโนโลยีและความอร่อยไว้ด้วยกัน
          ขอแนะนำให้ทุกคนมาสัมผัสประสบการณ์ที่ IoT Library & Cafe ของเรา ที่นี่คุณจะได้พบกับ
          เมนูเครื่องดื่มสุดพิเศษที่สามารถสั่งผ่านแอพ IoT ของเราได้
          มุมอ่านหนังสือที่มีระบบแนะนำหนังสืออัจฉริยะ ช่วยให้ค้นพบหนังสือที่ใช่
          พื้นที่ทำงานร่วมกันที่ใช้ระบบ Smart Lighting เพื่อสร้างบรรยากาศที่เหมาะสมกับการทำงานและการเรียนรู้
          Workshop สุดพิเศษ IoT, FastAPI และ React
        </p>

      </section>
      <section className="w-full flex justify-center">
        <img src={coffeeImage} alt="Coffee" className="w-full" />
      </section>
    </Layout>
  );
}
