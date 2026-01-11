import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <header className="bg-white px-8 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-full"></div>
          <span className="font-semibold text-lg">Barangay Kalusugan</span>
        </div>

        <nav className="flex gap-6 text-gray-600">
          <span className="font-semibold text-black">Dashboard</span>
          <span>User Profile</span>
          <span>Documents</span>
        </nav>

        <div className="text-sm">
          Admin User <span className="text-red-500 ml-2 cursor-pointer">⎋</span>
        </div>
      </header>

      {/* MAIN */}
      <main className="p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Overview</h2>

          <div className="flex gap-3">
            <select className="border px-3 py-2 rounded-md">
              <option>This year</option>
              <option>Last year</option>
            </select>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              + Import Data
            </button>

            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md">
              Export Data
            </button>
          </div>
        </div>

        {/* TOP CARDS */}
        <section className="grid grid-cols-4 gap-6">

          {/* Residential */}
          <div className="bg-white p-5 rounded-xl">
            <h4 className="font-semibold mb-4">Residential</h4>

            <div className="w-28 h-28 mx-auto rounded-full border-8 border-blue-600 flex flex-col items-center justify-center">
              <span className="text-xl font-bold">504</span>
              <span className="text-xs text-gray-500">Population</span>
            </div>

            <div className="text-sm mt-4">
              <p>✔ Voters 83%</p>
              <p>✖ Non-Voters 17%</p>
            </div>
          </div>

          {/* Employment */}
          <div className="bg-white p-5 rounded-xl">
            <h4 className="font-semibold mb-6">Employment Status</h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                Employed 80%
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                Unemployed 20%
              </div>
            </div>
          </div>

          {/* Housekeeper */}
          <div className="bg-white p-5 rounded-xl">
            <h4 className="font-semibold">HouseKeeper Status</h4>
            <h1 className="text-3xl font-bold mt-6">105</h1>
            <p className="text-green-600 text-sm mt-2">▲ 12%</p>
          </div>

          {/* Senior */}
          <div className="bg-white p-5 rounded-xl">
            <h4 className="font-semibold">Senior Citizen</h4>
            <h1 className="text-3xl font-bold mt-6">70</h1>
          </div>
        </section>

        {/* LOWER SECTION */}
        <section className="grid grid-cols-3 gap-6 mt-8">

          {/* Statistics */}
          <div className="bg-white p-5 rounded-xl col-span-2">
            <h4 className="font-semibold mb-4">Statistic of Documents</h4>

            <div className="flex items-end gap-3 h-40">
              {[100, 40, 70, 100, 120, 100, 70, 40, 100, 70, 100, 100].map(
                (h, i) => (
                  <div
                    key={i}
                    className="w-5 bg-blue-600 rounded-md"
                    style={{ height: `${h}px` }}
                  ></div>
                )
              )}
            </div>

            <div className="flex justify-between text-xs mt-2 text-gray-500">
              {[
                "JAN","FEB","MAR","APR","MAY","JUN",
                "JUL","AUG","SEP","OCT","NOV","DEC"
              ].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>

          {/* PWD */}
          <div className="bg-white p-5 rounded-xl">
            <h4 className="font-semibold mb-4">
              PWD Distribution <span className="text-sm text-gray-500">Total 109</span>
            </h4>

            {[
              ["Visual Impairment", "65%"],
              ["Physical Disability", "18%"],
              ["Hearing Impairment", "12%"],
              ["Mental / Psychosocial", "5%"],
              ["Others", "2%"],
            ].map(([label, value]) => (
              <div key={label} className="mb-4">
                <p className="text-sm mb-1">{label}</p>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-blue-600 rounded"
                    style={{ width: value }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}
