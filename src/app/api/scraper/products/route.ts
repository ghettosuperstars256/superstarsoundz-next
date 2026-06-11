import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { listScrapedProducts, updateProductStatus, deleteScrapedProduct, comparePrices } from '@/lib/scraper';
import { log } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || undefined;
    const status = searchParams.get('status') || undefined;
    const campaignId = searchParams.get('campaignId') || undefined;
    const search = searchParams.get('search') || undefined;

    let products = listScrapedProducts({ source, status, campaignId });

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }

    updateProductStatus(id, status);
    log(`Product ${id} status updated to ${status}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    deleteScrapedProduct(id);
    log(`Product ${id} deleted`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
