"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const apiDocumentation = [
  {
    category: "Authentication",
    endpoints: [
      {
        method: "POST",
        path: "/auth/login",
        description: "Authenticate user and get a session token.",
        parameters: [
          { name: "email", type: "string", required: true, description: "User's email address" },
          { name: "password", type: "string", required: true, description: "User's password" },
        ],
        example: {
          request: {
            method: "POST",
            path: "/auth/login",
            body: {
              email: "user@example.com",
              password: "userpassword",
            },
          },
          response: {
            status: 200,
            body: {
              token: "session_token",
            },
          },
        },
      },
      // Add more authentication endpoints here
    ],
  },
  {
    category: "Payments",
    endpoints: [
      {
        method: "GET",
        path: "/payment/get_orders",
        description: "Get all payment orders for a user.",
        parameters: [
          { name: "email", type: "string", required: true, description: "User's email address" },
        ],
        example: {
          request: {
            method: "GET",
            path: "/payment/get_orders",
            query: {
              email: "user@example.com",
            },
          },
          response: {
            status: 200,
            body: [
              {
                orderId: "order123",
                amount: 100,
                status: "completed",
                // other fields
              },
              // other orders
            ],
          },
        },
      },
      // Add more payment endpoints here
    ],
  },
  // Add more categories (Payouts, Subscriptions, Refunds, etc.) here
];

export default function Docs() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      {apiDocumentation.map((category) => (
        <Card key={category.category} className="mb-6">
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            {category.endpoints.map((endpoint) => (
              <div key={endpoint.path} className="mb-6">
                <CardTitle>{endpoint.method} {endpoint.path}</CardTitle>
                <CardDescription>{endpoint.description}</CardDescription>
                <h3 className="font-semibold mt-2">Parameters:</h3>
                <ul className="list-disc list-inside">
                  {endpoint.parameters.map((param) => (
                    <li key={param.name}>
                      <strong>{param.name}</strong> ({param.type}) - {param.description} {param.required && <span className="text-red-500">*</span>}
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold mt-2">Example:</h3>
                <pre className="bg-gray-200 p-4 rounded">
                  <code>
                    {JSON.stringify(endpoint.example, null, 2)}
                  </code>
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
