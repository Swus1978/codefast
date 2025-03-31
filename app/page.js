import ButtonLogin from "@/components/ButtonLogin";
import FAQListitem from "@/components/FAQListitem";
import productDemo from "@/app/productDemo.jpg";
import Image from "next/image";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      {/*HEADER*/}
      <section className="bg-base-200">
        <div className=" max-w-5xl mx-auto flex justify-between items-center px-8 py-2">
          <div className="font-bold">SwusTechSaas</div>
          <div className="space-x-4 max-md:hidden">
            <a className="link link-hover" href="#pricing">
              Pricing
            </a>
            <a className="link link-hover" href="#faq">
              FAQ
            </a>
          </div>
          <div>
            <ButtonLogin session={session} />
          </div>
        </div>
      </section>
      {/*  HERO */}
      <section className="bg-base-100 text-center lg:text-left py-32 px-8 max-w-5xl mx-auto flex flex-col lg:flex-row gap-14 items-center lg:items-start">
        <Image
          src={productDemo}
          alt="product demo"
          className="w-96 rounded-xl "
        />

        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Collect customer feedback to build better products
          </h1>
          <div className="opacity-90 mb-10">
            Create a feedback board in minutes, prioritize features, and build
            products your customers will love.
          </div>
          <ButtonLogin session={session} />
        </div>
      </section>
      {/* PRICING */}
      <section id="pricing" className="bg-base-200">
        <div className="py-32 px-8 max-w-3xl mx-auto">
          <p className="text-sm uppercase font-medium text-center text-primary mb-4">
            Pricing
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-12 text-center">
            A pricing that adapts to your needs
          </h2>

          <div className="p-8 bg-base-100 max-w-96 rounded-3xl mx-auto space-y-6">
            <div className="flex gap-2 items-baseline">
              <div className="text-4xl font-black">$19</div>
              <div className="uppercase text-sm font-medium opacity-60">
                /month
              </div>
            </div>

            <ul className="space-y-2">
              {[
                "Collect customer feedback",
                "Unlimited boards",
                "Admin dashboard",
                "24/7 support",
              ].map((priceItem) => (
                <li key={priceItem} className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {priceItem}
                </li>
              ))}
            </ul>
            <ButtonLogin session={session} extraStyle="w-full" />
          </div>
        </div>
      </section>
      {/*  FAQ */}
      <section id="faq" className="bg-base-200">
        <div className="py-32 px-8 max-w-3xl mx-auto">
          <p className="text-sm uppercase font-medium text-center text-primary mb-4">
            FAQ
          </p>

          <h2 className="text-3xl lg:text-4xl font-extrabold mb-12 text-center">
            Frequetly Asked Questions
          </h2>
          <ul className="max-w-lg-mx-auto">
            {[
              {
                question: "What do I get exactly?",
                answer: "Lorem Ipseum",
              },
              {
                question: "Can I get a refund?",
                answer: "Lorem Ipseum",
              },
              {
                question: "I have another question",
                answer: "Lorem Ipseum",
              },
            ].map((qa) => (
              <FAQListitem key={qa.question} qa={qa} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
