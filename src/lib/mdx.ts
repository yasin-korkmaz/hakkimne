/**
 * mdx.ts — MDX İçerik ve Frontmatter Yönetim Modülü
 *
 * Algoritma: Dosya sistemindeki (content/rehber) MDX içeriklerini tarar,
 * gray-matter ile meta verileri ayrıştırır ve statik sayfa üretimi (SSG) için
 * tip güvenli Post nesneleri döndürür.
 * Yasal Dayanak: 4857 sayılı İş Kanunu md. 24 (İşçinin haklı nedenle derhal fesih hakkı)
 * ve 1475 sayılı Kanun md. 14 (Kıdem tazminatına hak kazanma halleri) kapsamındaki
 * rehber ve bilgilendirme içeriklerinin yönetimini sağlar.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  author?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "rehber");

/**
 * getAllPosts — Tüm rehber yazılarını tarihe göre azalan (yeniden eskiye) sırada getirir.
 *
 * Algoritma: Klasörün varlığını kontrol eder, mdx/md uzantılı dosyaları okur,
 * frontmatter verilerini parse eder ve tarihe göre sıralayarak döndürür.
 * Klasör yoksa hata fırlatmaz, boş dizi döner.
 * Yasal Dayanak: 4857 sayılı Kanun ve 1475 sayılı Kanun md. 14 bilgilendirme arşivi.
 */
export function getAllPosts(): Post[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return [];
    }

    const fileNames = fs.readdirSync(CONTENT_DIR);
    const mdxFiles = fileNames.filter((file) => /\.mdx?$/.test(file));

    const posts: Post[] = [];

    for (const fileName of mdxFiles) {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(CONTENT_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(fileContents);

      posts.push({
        slug,
        frontmatter: {
          title: (data.title as string) || slug,
          description: (data.description as string) || "",
          date: (data.date as string) || "",
          category: (data.category as string) || "Genel",
          ...data,
        },
        content,
      });
    }

    return posts.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime() || 0;
      const dateB = new Date(b.frontmatter.date).getTime() || 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("MDX içerikleri okunurken hata oluştu:", error);
    return [];
  }
}

/**
 * getPostBySlug — Verilen slug değerine ait tekil MDX yazısını getirir.
 *
 * Algoritma: İlgili slug için .mdx veya .md dosyasını arar, bulursa
 * frontmatter ve ham markdown içeriğini döndürür; bulamazsa null döner.
 * Yasal Dayanak: 4857 sayılı Kanun md. 24 ve 1475 sayılı Kanun md. 14 rehber detayları.
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return null;
    }

    const cleanSlug = slug.replace(/\.mdx?$/, "");
    const mdxPath = path.join(CONTENT_DIR, `${cleanSlug}.mdx`);
    const mdPath = path.join(CONTENT_DIR, `${cleanSlug}.md`);

    let targetPath: string | null = null;
    if (fs.existsSync(mdxPath)) {
      targetPath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      targetPath = mdPath;
    }

    if (!targetPath) {
      return null;
    }

    const fileContents = fs.readFileSync(targetPath, "utf-8");
    const { data, content } = matter(fileContents);

    return {
      slug: cleanSlug,
      frontmatter: {
        title: (data.title as string) || cleanSlug,
        description: (data.description as string) || "",
        date: (data.date as string) || "",
        category: (data.category as string) || "Genel",
        ...data,
      },
      content,
    };
  } catch (error) {
    console.error(`Post (${slug}) okunurken hata oluştu:`, error);
    return null;
  }
}
