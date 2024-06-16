import Link from "next/link"
import NavSection from "@/components/NavSection"
import { getUserBySession } from "@/lib/actions"
import Welcome from "@/components/Welcome"

const Home = async () => {


  return (
    <main>
      <section>
        <NavSection />
        <Welcome></Welcome>
      </section>
    </main>
  )
}

export default Home

