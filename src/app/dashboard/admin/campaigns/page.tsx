import { listCampaigns, createCampaign, updateCampaign, deleteCampaign, runCampaign } from '@/lib/scraper';
import { Campaign, DEFAULT_CAMPAIGN_SETTINGS } from '@/lib/types';
import CampaignsClient from './CampaignsClient';

export default async function CampaignsPage() {
  const campaigns = listCampaigns();

  async function handleCreate(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const type = formData.get('type') as Campaign['type'];
    const keywords = (formData.get('keywords') as string).split(',').map(k => k.trim()).filter(Boolean);
    const category = formData.get('category') as string;
    const affiliateCode = formData.get('affiliateCode') as string;
    const maxResults = parseInt(formData.get('maxResults') as string) || 20;
    const schedule = formData.get('schedule') as Campaign['schedule'];
    const minPrice = parseFloat(formData.get('minPrice') as string) || 0;
    const maxPrice = parseFloat(formData.get('maxPrice') as string) || 10000;
    const minRating = parseFloat(formData.get('minRating') as string) || 0;
    const autoPublish = formData.get('autoPublish') === 'on';
    const autoAffiliate = formData.get('autoAffiliate') === 'on';
    const deduplicate = formData.get('deduplicate') === 'on';
    const imageRequired = formData.get('imageRequired') === 'on';

    createCampaign({
      name,
      type,
      keywords,
      category,
      affiliateCode,
      maxResults,
      schedule,
      settings: {
        ...DEFAULT_CAMPAIGN_SETTINGS,
        minPrice,
        maxPrice,
        minRating,
        autoPublish,
        autoAffiliate,
        deduplicate,
        imageRequired,
      },
    });
  }

  async function handleUpdate(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as Campaign['type'];
    const keywords = (formData.get('keywords') as string).split(',').map(k => k.trim()).filter(Boolean);
    const category = formData.get('category') as string;
    const affiliateCode = formData.get('affiliateCode') as string;
    const maxResults = parseInt(formData.get('maxResults') as string) || 20;
    const schedule = formData.get('schedule') as Campaign['schedule'];
    const minPrice = parseFloat(formData.get('minPrice') as string) || 0;
    const maxPrice = parseFloat(formData.get('maxPrice') as string) || 10000;
    const minRating = parseFloat(formData.get('minRating') as string) || 0;
    const autoPublish = formData.get('autoPublish') === 'on';
    const autoAffiliate = formData.get('autoAffiliate') === 'on';
    const deduplicate = formData.get('deduplicate') === 'on';
    const imageRequired = formData.get('imageRequired') === 'on';

    updateCampaign(id, {
      name,
      type,
      keywords,
      category,
      affiliateCode,
      maxResults,
      schedule,
      settings: {
        ...DEFAULT_CAMPAIGN_SETTINGS,
        minPrice,
        maxPrice,
        minRating,
        autoPublish,
        autoAffiliate,
        deduplicate,
        imageRequired,
      },
    });
  }

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    deleteCampaign(id);
  }

  async function handleRun(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await runCampaign(id);
  }

  async function handleToggleActive(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      updateCampaign(id, { isActive: !campaign.isActive });
    }
  }

  return (
    <CampaignsClient
      campaigns={campaigns}
      handleCreate={handleCreate}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      handleRun={handleRun}
      handleToggleActive={handleToggleActive}
    />
  );
}
