import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // body.professionalField
    const apiUrl = `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/app/jobs?berufsfeld=&was=${body.jobTitle}&wo=${body.location}&page=${body.page}&size=20&veroeffentlichtseit=60&umkreis=40`;

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': 'jobboerse-jobsuche',
      },
    });

    const text = await res.text();

    if (!text) {
      console.warn('Empty response received from API', { status: res.status });
      return NextResponse.json({ jobs: [], message: 'No data returned from job API' }, { status: res.status });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse JSON:', err, '\nResponse Text:', text);
      return NextResponse.json({ error: 'Invalid JSON from external API' }, { status: 500 });
    }

    if (!res.ok) {
      console.error('Non-OK response from API:', res.status, data);
      return NextResponse.json({ error: 'API returned error', details: data }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error in route:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

export const GET = () =>
  NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
