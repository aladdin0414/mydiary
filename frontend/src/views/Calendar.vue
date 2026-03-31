<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isSameMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import api from '../utils/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentDate = ref(new Date());
const diaries = ref<Record<string, string>>({}); // { 'YYYY-MM-DD': 'emoji' }
const recentDiaries = ref<any[]>([]);
const loading = ref(false);

const fetchMonthDiaries = async () => {
  const yearMonth = format(currentDate.value, 'yyyy-MM');
  loading.value = true;
  try {
    const res = await api.get(`/diaries/month/${yearMonth}`);
    const data: Record<string, string> = {};
    res.data.forEach((d: any) => {
      data[d.date] = d.mood_emoji;
    });
    diaries.value = data;
  } catch (err) {
    console.error('Failed to fetch month diaries:', err);
  } finally {
    loading.value = false;
  }
};

const fetchRecentDiaries = async () => {
  try {
    const res = await api.get('/diaries/search', { params: { q: '' } });
    if (res.data && Array.isArray(res.data)) {
      recentDiaries.value = res.data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
    }
  } catch (err) {
    console.error('Failed to fetch recent diaries:', err);
  }
};

const handleNextMonth = () => { currentDate.value = addMonths(currentDate.value, 1); };
const handlePrevMonth = () => { currentDate.value = subMonths(currentDate.value, 1); };

const handleDayClick = (date: Date) => {
  router.push(`/editor/${format(date, 'yyyy-MM-dd')}`);
};

const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

const daysInMonth = computed(() => {
  const start = startOfMonth(currentDate.value);
  const end = endOfMonth(currentDate.value);
  return eachDayOfInterval({ start, end });
});

const paddingStart = computed(() => {
  let d = getDay(startOfMonth(currentDate.value));
  return d === 0 ? 6 : d - 1; // 0 is Sunday, mapped to index 6
});

const isCurrentToday = (date: Date) => isToday(date);
const isFuture = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

const getPreview = (content: string) => {
  if (!content) return '暂无内容';
  return content.replace(/[#*`_>\[\]]/g, '').slice(0, 100) + '...';
};

const formatDateLocal = (dateStr: string) => {
  const d = new Date(dateStr);
  return format(d, 'MM月dd日 EEEE', { locale: zhCN });
};

watch(currentDate, fetchMonthDiaries);
onMounted(() => {
  fetchMonthDiaries();
  fetchRecentDiaries();
});
</script>

<template>
  <div class="space-y-8 animate-[fadeIn_0.5s_ease] pt-4">
    <!-- Calendar Section -->
    <section class="bg-surface-container-low rounded-[2rem] p-6 editorial-shadow border border-outline-variant/5">
      <div class="flex justify-between items-center mb-8 px-2">
          <div class="space-y-1">
              <h2 class="font-headline font-bold text-2xl text-primary tracking-tight">{{ format(currentDate, 'M月', { locale: zhCN }) }}</h2>
              <p class="font-label text-xs uppercase tracking-widest text-on-surface-variant">{{ format(currentDate, 'yyyy') }}</p>
          </div>
          <div class="flex gap-2">
              <button @click="handlePrevMonth" class="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button @click="handleNextMonth" class="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                      :disabled="isSameMonth(currentDate, new Date())"
                      :class="{ 'opacity-30 cursor-not-allowed': isSameMonth(currentDate, new Date()) }">
                  <span class="material-symbols-outlined">chevron_right</span>
              </button>
          </div>
      </div>

      <div class="grid grid-cols-7 gap-y-4 text-center">
          <!-- Day Labels -->
          <div v-for="day in weekDays" :key="day" class="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">
            {{ day }}
          </div>

          <!-- Padding -->
          <div v-for="i in paddingStart" :key="'pad-'+i" class="p-2"></div>

          <!-- Days -->
          <div v-for="date in daysInMonth" :key="date.toISOString()"
               @click="!isFuture(date) && handleDayClick(date)"
               class="relative flex flex-col items-center justify-center p-2 cursor-pointer group"
               :class="[isFuture(date) ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80 active:scale-95 transition-all']">
              
              <div v-if="isCurrentToday(date)" class="absolute inset-0 bg-primary/10 rounded-xl scale-90 border border-primary/20"></div>
              
              <span class="font-headline font-bold" :class="isCurrentToday(date) ? 'text-primary' : 'text-on-surface'">
                {{ format(date, 'd') }}
              </span>
              
              <div v-if="diaries[format(date, 'yyyy-MM-dd')]" class="w-1 h-1 rounded-full mt-1" :class="isCurrentToday(date) ? 'bg-primary' : 'bg-primary-dim'"></div>
          </div>
      </div>
    </section>

    <!-- Entries List Section -->
    <section class="space-y-6 pb-24">
      <div class="flex justify-between items-end px-2">
          <h3 class="font-headline font-bold text-xl text-on-surface">近期回顾</h3>
          <span class="font-label text-xs text-primary font-bold cursor-pointer hover:underline" @click="router.push('/search')">查看全部</span>
      </div>
      
      <div class="space-y-4">
          <div v-if="recentDiaries.length === 0 && !loading" class="text-center py-8 text-on-surface-variant font-body italic">
            暂无回顾记录。开始撰写吧！
          </div>
          
          <article v-for="diary in recentDiaries" :key="diary.id"
              @click="router.push(`/editor/${diary.date}`)"
              class="bg-surface-container-lowest p-6 rounded-[1.5rem] editorial-shadow border border-outline-variant/10 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]">
              <div class="absolute top-0 right-0 p-4">
                  <span class="inline-flex items-center px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-label font-bold uppercase tracking-widest rounded-full">
                    {{ diary.mood_emoji || '📝' }}
                  </span>
              </div>
              <time class="font-label text-xs text-on-surface-variant font-medium">{{ formatDateLocal(diary.date) }}</time>
              <h4 class="font-headline font-bold text-lg mt-2 text-primary">{{ diary.date }} 日记</h4>
              <p class="font-body text-on-surface-variant mt-2 line-clamp-2 italic">{{ getPreview(diary.content) }}</p>
          </article>
      </div>
    </section>
  </div>
</template>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
