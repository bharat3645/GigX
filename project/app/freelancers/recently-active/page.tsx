import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecentlyActivePage() {
  const activeFreelancers = [
    {
      id: 1,
      name: "Maya Patel",
      lastActive: "2 minutes ago",
      status: "Available Now",
      skills: ["NFT Development", "Smart Contracts"],
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "David Kim",
      lastActive: "5 minutes ago",
      status: "Available Now",
      skills: ["Blockchain Architecture", "Solidity"],
      image: "/placeholder.svg?height=40&width=40",
    },
    // Add more freelancers as needed
  ];

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">
            Recently Active Freelancers
          </h1>
          <p className="mt-2 text-gray-400">
            Find freelancers who are currently available
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-11">
          {activeFreelancers.map((freelancer) => (
            <Link
              key={freelancer.id}
              href={`/freelancers/recently-active/${freelancer.id}`}
              className="cursor-pointer"
            >
              <Card style={{ width: 'calc(100% + 35px)' }} className="bg-gray-900 border-gray-800 transition duration-300 hover:scale-105">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={freelancer.image} alt={freelancer.name} />
                    <AvatarFallback>
                      {freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {freelancer.name}
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className="bg-green-900 text-green-200">
                        {freelancer.status}
                      </Badge>
                      <span className="text-gray-400">
                        {freelancer.lastActive}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-gray-800 text-gray-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
