import { NextResponse } from 'next/server';
import { getScraperStats } from '@/lib/scraper';
import { log } from '@/lib/db';

export async function GET() {
  try {
    const stats = getScraperStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    log(`Scraper stats API error: ${error}`, 'error');
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
