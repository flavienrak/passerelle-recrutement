import React from 'react';
import Layout from '../components/Layout';

import { cgu } from '../lib/cgu';
import { cgv } from '../lib/cgv';
import { politique } from '../lib/politique';

export default function ConditionsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E17] to-[#1A1E2E] text-white">
        <div className="flex justify-center items-center">
          <div className="max-w-7xl flex flex-col gap-20 py-12">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold">{cgu.title}</h1>
                <p className="text-xl text-gray-400">{cgu.date}</p>
              </div>

              <div className="list-decimal list-inside flex flex-col gap-6">
                {cgu.content.map((item) => (
                  <div key={`cgu-${item.id}`} className="flex flex-col gap-2">
                    <p className="text-2xl font-semibold">
                      {item.id}. {item.name}
                    </p>
                    {Array.isArray(item.value) ? (
                      item.value.map((val, index) =>
                        val.type === 'string' ? (
                          <p key={`cgu-item-${index}`}>{val.act}</p>
                        ) : (
                          <a
                            key={`cgu-item-${index}`}
                            href={val.act}
                            target="_blank"
                            className="text-cyan-300"
                          >
                            {val.act}
                          </a>
                        )
                      )
                    ) : (
                      <p className="text-gray-200 leading-5">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold">{cgv.title}</h1>
                <p className="text-xl text-gray-400">{cgv.date}</p>
              </div>

              <div className="list-decimal list-inside flex flex-col gap-6">
                {cgv.content.map((item) => (
                  <div key={`cgv-${item.id}`} className="flex flex-col gap-2">
                    <p className="text-2xl font-semibold">
                      {item.id}. {item.name}
                    </p>
                    {Array.isArray(item.value) ? (
                      item.value.map((val, index) =>
                        val.type === 'string' ? (
                          <p key={`cgv-item-${index}`}>{val.act}</p>
                        ) : (
                          <a
                            key={`cgv-item-${index}`}
                            href={val.act}
                            target="_blank"
                            className="text-cyan-300"
                          >
                            {val.act}
                          </a>
                        )
                      )
                    ) : (
                      <p className="text-gray-200 leading-5">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold">{politique.title}</h1>
                <p className="text-xl text-gray-400">{politique.date}</p>
              </div>

              <div className="list-decimal list-inside flex flex-col gap-6">
                {politique.content.map((item) => (
                  <div key={`cgv-${item.id}`} className="flex flex-col gap-2">
                    <p className="text-2xl font-semibold">
                      {item.id}. {item.name}
                    </p>
                    {Array.isArray(item.value) ? (
                      item.value.map((val, index) =>
                        val.type === 'string' ? (
                          <p key={`politique-item-${index}`}>{val.act}</p>
                        ) : val.type === 'mail' ? (
                          <a
                            href={`mailto:${val.act}`}
                            key={`politique-item-${index}`}
                            className="text-cyan-300"
                          >
                            {val.act}
                          </a>
                        ) : (
                          <a
                            key={`politique-item-${index}`}
                            href={val.act}
                            target="_blank"
                            className="text-cyan-300"
                          >
                            {val.act}
                          </a>
                        )
                      )
                    ) : (
                      <p className="text-gray-200 leading-5">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
