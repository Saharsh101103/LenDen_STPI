
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Logo } from "@/components/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ClientRating from "@/components/Rating";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const testimonials = [
  {
    "content": "Len-Den PG has transformed how I manage transactions for my online business. The seamless integration and user-friendly interface make it effortless to process payments. Their top-notch security gives me peace of mind, knowing my customers' data is safe. Highly recommended!",
    "title": "Emily Johnson, E-commerce Entrepreneur",
    "src": "/lady-1.jpeg"
  },
  {
    "content": "As a digital marketer, Len-Den PG has been a game-changer for my clients' businesses. The low transaction fees and comprehensive analytics provide incredible value, allowing us to optimize our strategies and drive growth. Thank you, Len-Den PG!",
    "title": "Sarah Smith, Digital Marketer",
    "src": "/lady-2.webp"
  },
  {
    "content": "Len-Den PG has revolutionized the way I handle payments for my subscription service. The real-time updates and detailed reporting make it easy to track transactions and manage finances. It's more than just a payment gateway; it's a complete financial management tool.",
    "title": "John Doe, Subscription Service Provider",
    "src": "/man-1.jpg"
  },
  {
    "content": "Len-Den PG has redefined my payment processing experience, offering unparalleled efficiency and security. The fast onboarding process and developer-centric design made integration a breeze. Joining Len-Den PG has been a pivotal decision for my business!",
    "title": "David Brown, App Developer",
    "src": "/man-2.jpg"
  }
];

const features = [
  {
    "title": "Developer-Centric Design",
    "desc": "Our platform is built with developers in mind, providing intuitive APIs, comprehensive documentation, and robust support to make integration and development seamless and efficient.",
    "src": "/developer-first.svg"
  },
  {
    "title": "Seamless Integration",
    "desc": "Integrate our payment gateway into your application effortlessly with our clear and concise guides. Our APIs are designed for simplicity, ensuring a smooth integration process with minimal coding required.",
    "src": "/easy-integration.svg"
  },
  {
    "title": "Comprehensive Documentation",
    "desc": "Access the most up-to-date and detailed documentation to guide you through every step of using our services. Our documentation is constantly updated to reflect new features and best practices.",
    "src": "/up-to-date-docs.svg"
  },
  {
    "title": "Cost-Efficient Service (0.1% per transaction)",
    "desc": "Enjoy our competitive and transparent pricing model with just 0.1% per transaction. Get high-quality service at a fraction of the cost, maximizing your savings and profitability.",
    "src": "/low-cost.svg"
  },
  {
    "title": "Accelerated Onboarding",
    "desc": "Get started quickly with our streamlined onboarding process. Our user-friendly setup ensures you can begin accepting payments in no time, with minimal hassle and maximum efficiency.",
    "src": "/fast-onboarding.svg"
  },
  {
    "title": "Uncompromising Security",
    "desc": "Rest assured with our top-tier security measures. We prioritize your data protection with advanced encryption and stringent compliance standards to keep your transactions and information safe.",
    "src": "/maximum-security.svg"
  }
];

export default async function Page() {
  const { data: { session }, error } = await supabase.auth.getSession();

  const isLoggedIn = !!session;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="fixed z-50 flex w-full items-center justify-between bg-black px-4 py-2 lg:px-6 text-secondary">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="ml-auto hidden gap-4 sm:gap-6 md:flex">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="/auth/login"
          >
            Login
          </Link>
          <Link
            className="flex gap-2 text-sm font-medium underline-offset-4 hover:underline"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="flex gap-2 text-sm font-medium underline-offset-4 hover:underline"
            href="#contact"
          >
            Contact
          </Link>
        </nav>
        <Popover>
          <PopoverTrigger className="block md:hidden text-secondary">
            <Menu />
          </PopoverTrigger>
          <PopoverContent className="mr-3 flex w-fit flex-col items-center justify-center gap-4 bg-black px-8 py-4 font-semibold tracking-tight text-foreground">
            <Link
              className="underline-offset-4 hover:underline"
              href="/auth/login"
            >
              Login
            </Link>
            <Link
              className="flex gap-2 underline-offset-4 hover:underline"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="flex gap-2 underline-offset-4 hover:underline"
              href="#contact"
            >
              Contact
            </Link>
          </PopoverContent>
        </Popover>
      </header>
      <main className="flex-1">
        <section className="relative flex h-[30rem] w-full items-center justify-center bg-dot-white/30 bg-black  md:h-[50rem]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="flex w-fit items-center px-10">
            <div className="hidden md:block md:w-[35rem] lg:w-[55rem]">
              <AspectRatio ratio={1 / 1}>
                <Image src="/hero.svg" fill alt="img" />
              </AspectRatio>
            </div>
            <div className="container flex flex-col items-center justify-center space-y-8 p-0 text-center md:px-2 lg:min-h-[20rem]">
              <div className="space-y-2 md:max-w-2xl">
                <h1 className="text-secondary sm:text-primary-foregroundxl drop-shadow-2xl font-bold tracking-tighter md:text-5xl lg:text-6xl/none">
                  Welcome to Len-Den PG!
                </h1>
                <p className="text-wrap text-primary md:px-10 drop-shadow-2xl ">
                Empower Your Business with Seamless Integrations and Secure API Solutions.
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Link
                  className={buttonVariants({ variant: "secondary" })}
                  href="/auth/signup"
                >
                  Sign Up
                </Link>
                <Link
                  className={buttonVariants({ variant: "default" })}
                  href="/dashboard"
                >
                  {isLoggedIn ? "Dashboard" : "Sign In"}
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-primary py-12 md:py-24">
          <div className="container flex items-center gap-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-primary-foregroundxl sm:text-primary-foregroundxl font-bold tracking-tighter text-primary-foreground md:text-5xl">
                  Share your Story
                </h2>
                <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with friends and family. Post photos, videos, and
                  updates. Let your personality shine.
                </p>
              </div>
              <div className="grid gap-2">
                <Link
                  className={buttonVariants({
                    variant: "secondary",
                    className: "w-fit",
                  })}
                  href="/auth/signup"
                >
                  Create Account
                </Link>
              </div>
            </div>
            <div className="hidden w-[40rem] md:block">
            <AspectRatio ratio={16/10}>                
              <Image
                  alt="Image"
                  src="/dashboard.png"
                  className="rounded-2xl border-2 border-black drop-shadow-2xl shadow-black shadow-2xl"
                  fill
                />
              </AspectRatio>
                          </div>
          </div>
        </section>
        <section
          className="h-[70rem] text-secondary w-full dark:bg-black bg-black  dark:bg-grid-white/100 bg-grid-white/50 relative flex items-center justify-center"
          id="features"
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="z-10 flex flex-col items-center justify-center gap-14">
            <h1 className="text-primary-foregroundxl sm:text-primary-foregroundxl font-bold tracking-tighter md:text-5xl lg:text-6xl/none">
              What makes us different
            </h1>
            <div className="container grid grid-cols-1 flex-wrap justify-center gap-4 md:grid-cols-2 lg:flex lg:gap-4">
              {features.map((item) => (
                <Card
                  key={item.title}
                  className="max-w-sm transition-all hover:scale-105 bg-secondary"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-bold tracking-tighter">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="hidden items-center justify-center md:flex">
                    <div className="w-[200px]">
                      <AspectRatio ratio={1 / 1}>
                        <Image src={item.src} alt="" fill />
                      </AspectRatio>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="flex w-full items-center justify-center bg-primary  py-4">
          <div className="flex flex-col items-center space-y-8 px-4 py-10 text-center lg:min-h-[20rem]">
            <h1 className="text-primary-foregroundxl sm:text-primary-foregroundxl font-bold tracking-tighter md:text-5xl lg:text-6xl/none">
              Here&apos;s what our users say
            </h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((item) => (
                <Card
                  key={item.title}
                  className="max-w-lg transition-all hover:scale-105 bg-secondary"
                >
                  <CardHeader className="flex flex-col items-center gap-4 text-start md:flex-row">
                    <div className="w-[100px] md:w-[350px]">
                      <AspectRatio ratio={1 / 1}>
                        <Image
                          src={item.src}
                          alt=""
                          fill
                          quality={50}
                          className="rounded-full object-cover object-center"
                        />
                      </AspectRatio>
                    </div>
                    <CardTitle className="text-sm font-normal tracking-normal">
                      &quot;{item.content}&quot;
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="block font-semibold">
                    <p>{item.title}</p>
                    <ClientRating />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section
          className="w-full border-t py-12 md:py-24 lg:py-32 bg-black text-secondary"
          id="contact"
        >
          <div className="container grid items-center gap-6 px-4 text-center md:px-6">
            <div className="space-y-2">
              <h2 className="text-primary-foregroundxl md:text-primary-foregroundxl/tight font-bold tracking-tighter">
                Never miss an update from us
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up for our newsletter
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit" variant="secondary">Sign Up</Button>
              </form>
              <p className="space-x-1 text-xs text-muted">
                <span>By clicking you agree to our</span>
                <Link className="underline underline-offset-2" href="#">
                  terms & conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 px-4 py-6 sm:flex-row md:px-6 bg-black text-primary">
        <p className="text-xs">&copy; 2024 Len-Den PG. All rights reserved.</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}